const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8"
};

const DEFAULT_OPENAI_MODEL = "gpt-5";
const DEFAULT_OPENAI_SEARCH_TOOL = "web_search";

const SYSTEM_PROMPT = `You are the research engine for FOC Heat, a comic-book investment research application.

Objective: maximize expected aftermarket return on comic-book purchases made at or before Final Order Cutoff (FOC). Investment first, not reading recommendations.

Non-negotiable rules:
1. Never recommend a book whose FOC has already passed. If the user asks after FOC, classify it as POST-FOC WATCH instead of pretending it can still be ordered.
2. Verify FOC dates from current, independent sources. Prefer distributor/retailer FOC catalogs and publisher solicitations. State exactly what is verified.
3. Separate VERIFIED FACTS, MARKET EVIDENCE, and INVESTMENT THESIS.
4. Never invent print runs, pull-list counts, retailer order totals, sales figures, first appearances, ratios, or market prices. If unavailable, say UNKNOWN.
5. A #1, famous character, incentive ratio, creator reputation, or hype is not sufficient by itself.
6. Favor evidence that demand may exceed supply.
7. Account for entry price. A good book at cover price can be a bad investment after aftermarket prices rise.
8. Track prior predictions and explicitly learn from misses. Do not quietly rewrite history.
9. Use completed-sale evidence when evaluating released books whenever available; asking prices are weaker evidence.
10. Be conservative. It is better to return three strong candidates than ten weak ones.
11. Current date is supplied by the application. Resolve relative dates from it.
12. User purchase records are factual transaction data. Never change a prediction because the user purchased or skipped a book. Use purchase data only to evaluate realized outcomes and acquisition economics.

Return strict JSON with this shape:
{
  "reportDate": "YYYY-MM-DD",
  "cutoffLabel": "...",
  "summary": "...",
  "books": [
    {
      "rank": 1,
      "title": "...",
      "publisher": "...",
      "action": "BUY|WATCH|PASS|POST-FOC WATCH",
      "confidence": "High|Medium|Low-Medium|Low",
      "risk": "Low|Medium|High",
      "qty": "...",
      "investmentScore": 0,
      "maximumAcquisitionPrice": 0,
      "foc": "YYYY-MM-DD",
      "releaseDate": "YYYY-MM-DD",
      "creators": "...",
      "verifiedFacts": ["..."],
      "marketEvidence": ["..."],
      "thesis": "...",
      "unknowns": ["..."],
      "sources": ["https://..."]
    }
  ],
  "watchlistAdds": [{"title":"...","reason":"..."}],
  "ledgerNotes": ["..."],
  "methodologyChanges": ["..."]
}`;

function json(data, status = 200) { return new Response(JSON.stringify(data, null, 2), { status, headers: CORS_HEADERS }); }
function cleanJson(text) { const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i); return fenced ? fenced[1].trim() : text.trim(); }
function authorized(request, env) {
  if (!env.APP_TOKEN) return false;
  return (request.headers.get("Authorization") || "") === `Bearer ${env.APP_TOKEN}`;
}

async function openaiResearch(env, prompt) {
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured.");
  const model = env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
  const toolType = env.OPENAI_SEARCH_TOOL || DEFAULT_OPENAI_SEARCH_TOOL;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Authorization": `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, tools: [{ type: toolType }], input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ] })
  });
  if (!response.ok) { const body = await response.text(); throw new Error(`OpenAI API ${response.status}: ${body.slice(0, 1000)}`); }
  const data = await response.json();
  const text = data.output_text || (data.output || []).flatMap(item => item.content || []).map(item => item.text || "").join("\n");
  if (!text) throw new Error("OpenAI returned no text output.");
  return JSON.parse(cleanJson(text));
}

async function getJson(env, key, fallback) {
  if (!env.FOC_DATA) return fallback;
  const value = await env.FOC_DATA.get(key);
  return value ? JSON.parse(value) : fallback;
}
async function putJson(env, key, value) { if (env.FOC_DATA) await env.FOC_DATA.put(key, JSON.stringify(value)); }

async function refresh(env) {
  const current = new Date().toISOString();
  const previous = await getJson(env, "history", []);
  const ledger = await getJson(env, "ledger", []);
  const watchlist = await getJson(env, "watchlist", []);
  const purchases = await getJson(env, "purchases", {});
  const prompt = `Run this week's FOC Heat Report. Today is ${current.slice(0, 10)}.

You must research the next actual FOC cutoff, not assume that the current calendar week is correct. Search for the next active FOC window and verify dates before recommending anything.

Historical prediction ledger:
${JSON.stringify(ledger, null, 2)}

Current watchlist:
${JSON.stringify(watchlist, null, 2)}

User transaction data. This is factual user activity, not evidence for or against a book. Do not change historical predictions because of it:
${JSON.stringify(purchases, null, 2)}

Previous reports (use them for continuity and error analysis; do not alter them):
${JSON.stringify(previous.slice(-6), null, 2)}

Find the best investment opportunities in the next FOC window. Include only books for which you can establish an actual FOC date. If a previously watched book is now at FOC, evaluate it. If a book's FOC has passed, do not include it as a buy candidate.

Research current publisher solicitations, distributor/retailer FOC listings, reputable comic news, community demand signals, and current market evidence where relevant. Cite URLs in the JSON sources array.`;
  const report = await openaiResearch(env, prompt);
  report.generatedAt = current;
  const entry = { ...report, savedAt: current };
  const history = [...previous, entry].slice(-52);
  await putJson(env, "current", entry);
  await putJson(env, "history", history);
  const newWatch = [...watchlist];
  for (const item of report.watchlistAdds || []) if (!newWatch.some(x => x.title.toLowerCase() === item.title.toLowerCase())) newWatch.push(item);
  await putJson(env, "watchlist", newWatch);
  return entry;
}

function normalizePurchase(body) {
  const position = body.position || body;
  return {
    status: position.status || "Ordered",
    quantity: Number(position.quantity || 0),
    pricePerCopy: Number(position.pricePerCopy || 0),
    priceBasis: position.priceBasis || "Unknown",
    purchaseDate: position.purchaseDate || "",
    retailer: position.retailer || "",
    notes: position.notes || "",
    foc: position.foc || "",
    releaseDate: position.releaseDate || "",
    publisher: position.publisher || "",
    creators: position.creators || "",
    variant: position.variant || "",
    updatedAt: new Date().toISOString()
  };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api/health") return json({ ok: true, configured: !!env.OPENAI_API_KEY && !!env.APP_TOKEN, model: env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL, searchTool: env.OPENAI_SEARCH_TOOL || DEFAULT_OPENAI_SEARCH_TOOL });
      if (!authorized(request, env)) return json({ error: "Unauthorized" }, 401);
      if (url.pathname === "/api/report" && request.method === "GET") {
        const report = await getJson(env, "current", null);
        return json(report || { error: "No report has been generated yet." }, report ? 200 : 404);
      }
      if (url.pathname === "/api/history" && request.method === "GET") return json(await getJson(env, "history", []));
      if (url.pathname === "/api/watchlist" && request.method === "GET") return json(await getJson(env, "watchlist", []));
      if (url.pathname === "/api/purchases" && request.method === "GET") return json(await getJson(env, "purchases", {}));
      if (url.pathname === "/api/purchases" && request.method === "POST") {
        const body = await request.json();
        if (!body || !body.title) return json({ error: "title is required" }, 400);
        const purchases = await getJson(env, "purchases", {});
        const title = String(body.title).trim();
        purchases[title] = normalizePurchase(body);
        await putJson(env, "purchases", purchases);
        return json(purchases[title], 201);
      }
      if (url.pathname === "/api/purchases" && request.method === "DELETE") {
        const title = url.searchParams.get("title");
        if (!title) return json({ error: "title is required" }, 400);
        const purchases = await getJson(env, "purchases", {});
        delete purchases[title];
        await putJson(env, "purchases", purchases);
        return json({ ok: true });
      }
      if (url.pathname === "/api/refresh" && request.method === "POST") return json(await refresh(env));
      return json({ error: "Not found" }, 404);
    } catch (error) { return json({ error: error.message || "Unknown server error" }, 500); }
  }
};
