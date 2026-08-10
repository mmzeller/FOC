const FALLBACK_REPORT = {
  reportDate: "2026-08-10",
  cutoffLabel: "Monday, Aug 10",
  summary: "Stored baseline report. Configure the V2 backend to run live research.",
  books: [
    {rank:1,title:"CROWBOUND #1",publisher:"Image Comics",action:"BUY",investmentScore:94,confidence:"High",risk:"Medium",qty:"3–5",foc:"2026-08-10",releaseDate:"2026-09-02",verifiedFacts:["Creator-owned Image launch.","FOC date was verified in the baseline research."],marketEvidence:["Established creator audience; actual print run remains unknown."],thesis:"Creator-owned Lemire/Nguyen reunion with strong genre appeal and scarcity potential.",unknowns:["Actual print run and retailer order totals are not public."],sources:[]},
    {rank:2,title:"TALES OF WONDER #1",publisher:"Image / Skybound",action:"BUY",investmentScore:89,confidence:"Medium",risk:"Medium-High",qty:"2–3",foc:"2026-08-10",releaseDate:"2026-09-02",verifiedFacts:["Creator-owned Steve Skroce launch."],marketEvidence:["Strong incentive structure; demand evidence is weaker than Crowbound."],thesis:"Interesting upside from creator-owned superhero material and a collectible incentive structure.",unknowns:["Actual print run and retailer order totals."],sources:[]},
    {rank:3,title:"TEEN TITANS #1",publisher:"DC",action:"BUY",investmentScore:83,confidence:"Medium",risk:"Medium-High",qty:"1–2",foc:"2026-08-10",releaseDate:"2026-09-02",verifiedFacts:["Major DC relaunch with new characters."],marketEvidence:["Strong mainstream collector audience; supply could also be high."],thesis:"New-character potential and major creators make this worth a small position, but not a deep buy.",unknowns:["Whether any new character becomes a durable key."],sources:[]},
    {rank:4,title:"LEGION OF SUPER-HEROES #1",publisher:"DC",action:"BUY",investmentScore:79,confidence:"Medium",risk:"High",qty:"1",foc:"2026-08-10",releaseDate:"2026-09-02",verifiedFacts:["New future for the Legion with a new creative direction."],marketEvidence:["Strong legacy IP but inconsistent modern speculation history."],thesis:"Worth one copy as a speculative position, not a high-conviction investment.",unknowns:["Durable collector demand."],sources:[]},
    {rank:5,title:"A GHOST ARM MADE OF ANGRY GHOSTS #1",publisher:"Oni",action:"BUY",investmentScore:76,confidence:"Low-Medium",risk:"High",qty:"1",foc:"2026-08-10",releaseDate:"2026-09-02",verifiedFacts:["Original Oni horror property."],marketEvidence:["Favorable early critical response; scarcity and collector demand unproven."],thesis:"Potential sleeper, but insufficient evidence for a larger position.",unknowns:["Print run and aftermarket demand."],sources:[]}
  ],
  watchlistAdds: [],
  ledgerNotes: ["Minotaur #1 — LOSS / near-cover aftermarket after release.","Black Star #1 — LOSS / still near cover price.","Crowbound #1 — PENDING.","Tales of Wonder #1 — PENDING.","The Forever Home #1 — PENDING."],
  methodologyChanges: ["Weight demand-vs-supply evidence more heavily than creator reputation alone."]
};

const API_BASE = String(window.FOC_API_BASE || "").replace(/\/$/, "");
let activeReport = FALLBACK_REPORT;

function esc(s){return String(s ?? "").replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]))}
function showStatus(message, error=false){const s=document.querySelector('#status');s.hidden=false;s.className=`status ${error?'error':''}`;s.textContent=message;if(!error)setTimeout(()=>s.hidden=true,5000)}
function api(path, options={}){return fetch(`${API_BASE}${path}`,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}}).then(async r=>{const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.error||`Request failed (${r.status})`);return body})}

function renderBook(b){
  const sources=(b.sources||[]).filter(Boolean).map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">Source</a>`).join(" ");
  const facts=(b.verifiedFacts||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  const evidence=(b.marketEvidence||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  const unknowns=(b.unknowns||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  return `<article class="book"><div class="book-top"><div><div class="rank">#${esc(b.rank)}</div><h3>${esc(b.title)}</h3><div class="publisher">${esc(b.publisher)}</div></div><span class="badge ${(b.action||'').toLowerCase().replace(/[^a-z-]/g,'-')}">${esc(b.action)}</span></div><div class="book-grid"><div class="metric"><span>Investment</span><strong>${esc(b.investmentScore)}/100</strong></div><div class="metric"><span>Confidence</span><strong>${esc(b.confidence)}</strong></div><div class="metric"><span>Buy</span><strong>${esc(b.qty)}</strong></div></div><div class="dates"><span>FOC ${esc(b.foc||'Unknown')}</span><span>Release ${esc(b.releaseDate||'Unknown')}</span></div><details><summary>Research evidence</summary><div class="evidence"><h4>Verified facts</h4><ul>${facts||'<li>None recorded.</li>'}</ul><h4>Market evidence</h4><ul>${evidence||'<li>None recorded.</li>'}</ul><h4>Investment thesis</h4><p>${esc(b.thesis||'')}</p><h4>Unknowns</h4><ul>${unknowns||'<li>None recorded.</li>'}</ul><div class="sources">${sources}</div></div></details></article>`;
}

function render(report, watchlist=null){
  activeReport=report||FALLBACK_REPORT;
  document.querySelector('#reportTitle').textContent=`FOC Heat — ${activeReport.reportDate||'Current'}`;
  document.querySelector('#reportMeta').textContent=`${activeReport.summary||'Investment first.'} ${activeReport.generatedAt?`Generated ${new Date(activeReport.generatedAt).toLocaleString()}.`:''}`;
  document.querySelector('#cutoff').textContent=activeReport.cutoffLabel||'—';
  document.querySelector('#report').innerHTML=(activeReport.books||[]).map(renderBook).join('')||'<div class="empty">No report available.</div>';
  const wl=watchlist || (activeReport.watchlistAdds||[]);
  document.querySelector('#watchCount').textContent=wl.length;
  document.querySelector('#watchlist').innerHTML=wl.map(x=>`<div class="watch-item"><strong>${esc(x.title||x[0])}</strong><span>${esc(x.reason||x[1]||'')}</span></div>`).join('')||'<div class="empty">No watchlist items.</div>';
  const notes=activeReport.ledgerNotes||[];
  document.querySelector('#ledger').innerHTML=notes.map(x=>`<div class="ledger-item"><strong>${esc(x)}</strong></div>`).join('')||'<div class="empty">No ledger entries.</div>';
}

async function loadLive(){
  if(!API_BASE){render(FALLBACK_REPORT);showStatus('V2 is installed, but the secure API URL has not been configured yet.');return}
  try{
    const [report,watch]=await Promise.all([api('/api/report'),api('/api/watchlist')]);
    render(report,watch);
    showStatus('Live research backend connected.');
  }catch(e){render(FALLBACK_REPORT);showStatus(`Backend unavailable: ${e.message}`,true)}
}

async function refresh(){
  const btn=document.querySelector('#refreshBtn');btn.disabled=true;btn.classList.add('busy');showStatus(API_BASE?'Researching the next FOC window… this can take a little while.':'Configure the secure API URL before running live research.');
  if(!API_BASE){btn.disabled=false;btn.classList.remove('busy');return}
  try{const report=await api('/api/refresh',{method:'POST'});const watch=await api('/api/watchlist');render(report,watch);showStatus('New FOC Heat Report saved to the research history.')}catch(e){showStatus(`Refresh failed: ${e.message}`,true)}finally{btn.disabled=false;btn.classList.remove('busy')}
}

document.querySelector('#refreshBtn').addEventListener('click',refresh);
document.querySelectorAll('.nav button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const id=btn.dataset.target;if(id==='top')window.scrollTo({top:0,behavior:'smooth'});else document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}));
render(FALLBACK_REPORT);
loadLive();
