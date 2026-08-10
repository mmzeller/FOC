const FALLBACK_REPORT = {
  reportDate: "2026-08-10",
  cutoffLabel: "Monday, Aug 10",
  summary: "Stored baseline report. Live research is intentionally performed in ChatGPT so there is no paid API requirement.",
  books: [
    {rank:1,title:"CROWBOUND #1",publisher:"Image Comics",action:"BUY",investmentScore:94,confidence:"High",risk:"Medium",qty:"3–5",foc:"2026-08-10",releaseDate:"2026-09-02",verifiedFacts:["Creator-owned Image launch.","FOC date was verified in the baseline research."],marketEvidence:["Established creator audience; actual print run remains unknown."],thesis:"Creator-owned Lemire/Nguyen reunion with strong genre appeal and scarcity potential.",unknowns:["Actual print run and retailer order totals are not public."],sources:[]},
    {rank:2,title:"TALES OF WONDER #1",publisher:"Image / Skybound",action:"BUY",investmentScore:89,confidence:"Medium",risk:"Medium-High",qty:"2–3",foc:"2026-08-10",releaseDate:"2026-09-02",verifiedFacts:["Creator-owned Steve Skroce launch."],marketEvidence:["Strong incentive structure; demand evidence is weaker than Crowbound."],thesis:"Interesting upside from creator-owned superhero material and a collectible incentive structure.",unknowns:["Actual print run and retailer order totals."],sources:[]},
    {rank:3,title:"TEEN TITANS #1",publisher:"DC",action:"BUY",investmentScore:83,confidence:"Medium",risk:"Medium-High",qty:"1–2",foc:"2026-08-10",releaseDate:"2026-09-02",verifiedFacts:["Major DC relaunch with new characters."],marketEvidence:["Strong mainstream collector audience; supply could also be high."],thesis:"New-character potential and major creators make this worth a small position, but not a deep buy.",unknowns:["Whether any new character becomes a durable key."],sources:[]}
  ],
  watchlistAdds: [],
  ledgerNotes: ["Minotaur #1 — LOSS / near-cover aftermarket after release.","Black Star #1 — LOSS / still near cover price.","Crowbound #1 — PENDING.","Tales of Wonder #1 — PENDING.","The Forever Home #1 — PENDING."],
  methodologyChanges: ["Weight demand-vs-supply evidence more heavily than creator reputation alone."]
};

function esc(s){return String(s ?? "").replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]))}
function showStatus(message,error=false){const s=document.querySelector('#status');s.hidden=false;s.className=`status ${error?'error':''}`;s.textContent=message;if(!error)setTimeout(()=>s.hidden=true,9000)}
function renderBook(b){
  const sources=(b.sources||[]).filter(Boolean).map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">Source</a>`).join(" ");
  const facts=(b.verifiedFacts||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  const evidence=(b.marketEvidence||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  const unknowns=(b.unknowns||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  return `<article class="book"><div class="book-top"><div><div class="rank">#${esc(b.rank)}</div><h3>${esc(b.title)}</h3><div class="publisher">${esc(b.publisher)}</div></div><span class="badge ${(b.action||'').toLowerCase().replace(/[^a-z-]/g,'-')}">${esc(b.action)}</span></div><div class="book-grid"><div class="metric"><span>Investment</span><strong>${esc(b.investmentScore)}/100</strong></div><div class="metric"><span>Confidence</span><strong>${esc(b.confidence)}</strong></div><div class="metric"><span>Buy</span><strong>${esc(b.qty)}</strong></div></div><div class="dates"><span>FOC ${esc(b.foc||'Unknown')}</span><span>Release ${esc(b.releaseDate||'Unknown')}</span></div><details><summary>Research evidence</summary><div class="evidence"><h4>Verified facts</h4><ul>${facts||'<li>None recorded.</li>'}</ul><h4>Market evidence</h4><ul>${evidence||'<li>None recorded.</li>'}</ul><h4>Investment thesis</h4><p>${esc(b.thesis||'')}</p><h4>Unknowns</h4><ul>${unknowns||'<li>None recorded.</li>'}</ul><div class="sources">${sources}</div></div></details></article>`;
}
function render(report,watchlist){
  const r=report||FALLBACK_REPORT;
  document.querySelector('#reportTitle').textContent=`FOC Heat — ${r.reportDate||'Current'}`;
  document.querySelector('#reportMeta').textContent=`${r.summary||'Investment first.'} ${r.generatedAt?`Generated ${new Date(r.generatedAt).toLocaleString()}.`:''}`;
  document.querySelector('#cutoff').textContent=r.cutoffLabel||'—';
  document.querySelector('#report').innerHTML=(r.books||[]).map(renderBook).join('')||'<div class="empty">No report available.</div>';
  const wl=watchlist || r.watchlistAdds || [];
  document.querySelector('#watchCount').textContent=wl.length;
  document.querySelector('#watchlist').innerHTML=wl.map(x=>`<div class="watch-item"><strong>${esc(x.title||x[0])}</strong><span>${esc(x.reason||x[1]||'')}</span></div>`).join('')||'<div class="empty">No watchlist items.</div>';
  document.querySelector('#ledger').innerHTML=(r.ledgerNotes||[]).map(x=>`<div class="ledger-item"><strong>${esc(x)}</strong></div>`).join('')||'<div class="empty">No ledger entries.</div>';
}
async function loadData(){
  try{
    const [report,watch]=await Promise.all([
      fetch('data/current.json',{cache:'no-store'}).then(r=>r.ok?r.json():FALLBACK_REPORT),
      fetch('data/watchlist.json',{cache:'no-store'}).then(r=>r.ok?r.json():[])
    ]);
    render(report,watch);
  }catch(e){render(FALLBACK_REPORT,[]);showStatus('Using the built-in baseline report.',true)}
}

function buildResearchPrompt(){
  const today=new Date().toISOString().slice(0,10);
  return `I am continuing my FOC Heat comic-book investment research project. The canonical repository is https://github.com/mmzeller/foc. Today is ${today}.

BEFORE RESEARCHING: inspect the repository and read PROJECT_CONTEXT.md, data/predictions.json, data/watchlist.json, data/current.json, and research-prompt.md. Treat those files as the project's source of truth. If you cannot access GitHub, say so and tell me exactly which files I need to provide; do not guess at the project's history.

RUN THIS WEEK'S FOC HEAT REPORT.

NON-NEGOTIABLE RULES:
1. Investment first. The goal is aftermarket profit and risk-adjusted return, not reading recommendations.
2. Determine the next relevant FOC cutoff for the user's market before evaluating candidates.
3. Verify the exact FOC cutoff with current, credible evidence. Cross-check publisher/distributor/retailer evidence when possible.
4. Never recommend a book as a current FOC buy if its FOC has already passed. Put missed books in POST-FOC OPPORTUNITIES instead.
5. Separate VERIFIED FACTS, MARKET EVIDENCE, INVESTMENT THESIS, and UNKNOWN/UNVERIFIED INFORMATION.
6. Never fabricate print runs, retailer orders, pull-list counts, sales, completed-sale prices, scarcity, first appearances, or any other unknown fact.
7. Distinguish asking prices from completed sales.
8. A #1, famous character, famous creator, incentive ratio, or large number of variants does not automatically make a book a buy.
9. Weight demand-versus-supply evidence more heavily than creator reputation alone.
10. Treat acquisition price as part of the investment thesis.
11. Use conservative conviction language rather than false numerical precision when evidence is incomplete.
12. Compare new candidates against the historical prediction ledger and explain how prior wins/misses should affect the thesis.
13. Be ruthless. If evidence is weak, say PASS or WATCH rather than forcing a BUY.

OUTPUT:
- Exact next FOC date and ordering window.
- Strongest BUY candidates first.
- WATCH candidates.
- PASS candidates.
- POST-FOC OPPORTUNITIES.
- For every serious candidate: title, publisher, release date, exact FOC date, creators, verified facts, market evidence, investment thesis, unknowns, risk, confidence, suggested quantity, reasonable maximum acquisition price if supportable, and source links.
- Explicitly flag evidence that is weak or unverified.
- End with the actual shopping list for someone trying to maximize risk-adjusted profit.
- Preserve historical predictions; do not rewrite history to make prior calls look better.

IMPORTANT: Do not merely repeat the stored current report. Re-research the current FOC window from fresh sources. The stored report is historical context, not proof that its dates or recommendations remain current.`;
}

async function requestResearch(){
  const prompt=buildResearchPrompt();
  let copied=false;
  try{
    await navigator.clipboard.writeText(prompt);
    copied=true;
  }catch(e){
    try{
      const ta=document.createElement('textarea');
      ta.value=prompt;ta.style.position='fixed';ta.style.opacity='0';
      document.body.appendChild(ta);ta.focus();ta.select();copied=document.execCommand('copy');ta.remove();
    }catch(_){copied=false}
  }

  // ChatGPT supports query-prefilled links in supported clients. The clipboard copy
  // remains the fallback because very long URLs may be truncated by some browsers.
  const chatUrl=`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
  try{window.open(chatUrl,'_blank','noopener');}catch(e){window.location.href=chatUrl;}

  if(copied){
    showStatus('The complete FOC research prompt was copied and ChatGPT was opened with the prompt prefilled when supported. If the message box is not prefilled, paste from your clipboard and press Send.');
  }else{
    showStatus('ChatGPT was opened. The prompt could not be copied automatically; use research-prompt.md or the README continuity prompt.',true);
  }
}

document.querySelector('#refreshBtn').addEventListener('click',requestResearch);
document.querySelectorAll('.nav button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const id=btn.dataset.target;if(id==='top')window.scrollTo({top:0,behavior:'smooth'});else document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}));
render(FALLBACK_REPORT,[]);
loadData();
