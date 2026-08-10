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
function showStatus(message,error=false){const s=document.querySelector('#status');s.hidden=false;s.className=`status ${error?'error':''}`;s.textContent=message;if(!error)setTimeout(()=>s.hidden=true,6000)}
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
async function requestResearch(){
  const prompt=`Run this week's FOC Heat Report for my FOC Heat investment project.\n\nIMPORTANT: investment first. Verify the actual upcoming FOC cutoff before recommending anything. Do not recommend books whose FOC has already passed. Cross-check FOC dates using current publisher/distributor/retailer evidence.\n\nFor every serious candidate, separate VERIFIED FACTS, MARKET EVIDENCE, INVESTMENT THESIS, and UNKNOWN/UNVERIFIED INFORMATION. Never invent print runs, retailer orders, pull-list counts, sales figures, or prices.\n\nUse our prediction history: Minotaur #1 = LOSS/near-cover aftermarket; Black Star #1 = LOSS/still near cover. Pending: Crowbound #1, Tales of Wonder #1, The Forever Home #1. Weight demand-versus-supply evidence more heavily than creator reputation, character fame, or variant ratios alone.\n\nReturn the strongest BUY candidates first, then WATCH, then PASS. Include exact FOC date, release date, suggested quantity, risk, confidence, and source links. Also identify any post-FOC opportunity worth watching. Be ruthless: if evidence is weak, say so.`;
  try{
    await navigator.clipboard.writeText(prompt);
    showStatus('Research prompt copied. Opening ChatGPT — run the report there, then update the app data with the resulting report.');
  }catch(e){showStatus('Could not copy automatically. The research prompt is available in research-prompt.md in the repository.',true)}
  window.open('https://chatgpt.com/','_blank','noopener');
}
document.querySelector('#refreshBtn').addEventListener('click',requestResearch);
document.querySelectorAll('.nav button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const id=btn.dataset.target;if(id==='top')window.scrollTo({top:0,behavior:'smooth'});else document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}));
render(FALLBACK_REPORT,[]);
loadData();
