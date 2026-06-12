/* ============================================================
   MCP Explained — interactive behaviours
   ============================================================ */

/* ---- Scroll progress bar ---- */
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.width = (scrolled * 100) + '%';
}, { passive: true });

/* ---- Reveal-on-scroll ---- */
const revealTargets = document.querySelectorAll('.section, .hero-analogy, .closer');
revealTargets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealTargets.forEach(el => io.observe(el));

/* ============================================================
   Before / After wiring diagrams
   ============================================================ */
function drawWires() {
  const ais = ['🤖', '💬', '⚙️'];
  const sys = ['CRM', 'Docs', 'DB', 'Mail'];

  // BEFORE: every AI wired to every system (M x N)
  const before = document.getElementById('svgBefore');
  if (before) {
    let s = '';
    const leftX = 40, rightX = 280;
    const ays = ais.map((_, i) => 50 + i * 60);
    const sysY = sys.map((_, i) => 35 + i * 50);
    // tangled lines
    ays.forEach(ay => sysY.forEach(sy => {
      s += `<line x1="${leftX}" y1="${ay}" x2="${rightX}" y2="${sy}" stroke="#fbbf24" stroke-opacity="0.45" stroke-width="1.2"/>`;
    }));
    ais.forEach((a, i) => {
      s += `<circle cx="${leftX}" cy="${ays[i]}" r="16" fill="#1a2348" stroke="#fbbf24"/>`;
      s += `<text x="${leftX}" y="${ays[i] + 5}" text-anchor="middle" font-size="14">${a}</text>`;
    });
    sys.forEach((sname, i) => {
      s += `<rect x="${rightX - 22}" y="${sysY[i] - 13}" width="46" height="26" rx="6" fill="#1a2348" stroke="#fbbf24"/>`;
      s += `<text x="${rightX + 1}" y="${sysY[i] + 4}" text-anchor="middle" font-size="10" fill="#eaf0ff">${sname}</text>`;
    });
    before.innerHTML = s;
  }

  // AFTER: everyone connects to one hub (M + N)
  const after = document.getElementById('svgAfter');
  if (after) {
    let s = '';
    const leftX = 40, hubX = 160, rightX = 280, hubY = 110;
    const ays = ais.map((_, i) => 50 + i * 60);
    const sysY = sys.map((_, i) => 35 + i * 50);
    ays.forEach(ay => { s += `<line x1="${leftX}" y1="${ay}" x2="${hubX}" y2="${hubY}" stroke="#34d399" stroke-opacity="0.7" stroke-width="1.6"/>`; });
    sysY.forEach(sy => { s += `<line x1="${hubX}" y1="${hubY}" x2="${rightX}" y2="${sy}" stroke="#34d399" stroke-opacity="0.7" stroke-width="1.6"/>`; });
    // hub
    s += `<circle cx="${hubX}" cy="${hubY}" r="26" fill="#0f1530" stroke="#22d3ee" stroke-width="2"/>`;
    s += `<text x="${hubX}" y="${hubY + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#22d3ee">MCP</text>`;
    ais.forEach((a, i) => {
      s += `<circle cx="${leftX}" cy="${ays[i]}" r="16" fill="#1a2348" stroke="#34d399"/>`;
      s += `<text x="${leftX}" y="${ays[i] + 5}" text-anchor="middle" font-size="14">${a}</text>`;
    });
    sys.forEach((sname, i) => {
      s += `<rect x="${rightX - 22}" y="${sysY[i] - 13}" width="46" height="26" rx="6" fill="#1a2348" stroke="#34d399"/>`;
      s += `<text x="${rightX + 1}" y="${sysY[i] + 4}" text-anchor="middle" font-size="10" fill="#eaf0ff">${sname}</text>`;
    });
    after.innerHTML = s;
  }
}
drawWires();

/* ============================================================
   End-to-end walkthrough
   ============================================================ */
const STEPS = [
  { lane: 'user',   tag: 'Request',  text: '“Refund Maria’s duplicate charge and email her an apology.”', bubble: 'Employee asks the AI assistant in plain English.' },
  { lane: 'host',   tag: 'Understand', text: 'The AI Host figures out it needs the billing system — and which MCP tools can help.', bubble: 'The AI plans the steps and picks the right tools.' },
  { lane: 'server', tag: 'Discover',  text: 'It asks the MCP Server: “What can you do?” The Server lists its Tools & Resources.', bubble: 'MCP Server advertises exactly what it allows.' },
  { lane: 'server', tag: 'Read',      text: 'The AI reads Maria’s recent charges (a Resource) to confirm the duplicate.', bubble: 'Pulling live context — grounded in real data.' },
  { lane: 'user',   tag: 'Approve',   text: 'Refunds need a human. The AI shows its plan; the employee clicks “Approve.”', bubble: '🔒 Human-in-the-loop: sensitive action needs sign-off.', kind: 'approval' },
  { lane: 'system', tag: 'Act',       text: 'The Server runs the “issue refund” Tool against the billing system.', bubble: 'Approved action executed in the real system.' },
  { lane: 'system', tag: 'Act',       text: 'A second Tool drafts the apology email for the employee to send.', bubble: 'Multiple tools chained to finish the job.' },
  { lane: 'host',   tag: 'Confirm',   text: 'The AI reports back: refund issued, email drafted, with a log of every step.', bubble: '✅ Done — traceable and auditable end to end.', kind: 'done' },
];

const lanes = document.querySelectorAll('.lane');
const bubble = document.getElementById('demoBubble');
const stepsWrap = document.getElementById('demoSteps');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnPlay = document.getElementById('btnPlay');

let idx = -1;
let playing = false;
let timer = null;

// build step chips
STEPS.forEach((st, i) => {
  const chip = document.createElement('div');
  chip.className = 'step-chip';
  chip.innerHTML = `<b>${i + 1}. ${st.tag}</b>${st.text}`;
  chip.addEventListener('click', () => { stopPlay(); goto(i); });
  stepsWrap.appendChild(chip);
});
const chips = stepsWrap.querySelectorAll('.step-chip');

function render() {
  lanes.forEach(l => l.classList.remove('active'));
  chips.forEach((c, i) => {
    c.classList.toggle('active', i === idx);
    c.classList.toggle('done', i < idx);
  });
  if (idx < 0) {
    bubble.textContent = 'Press “Play” to begin a sample request.';
    bubble.className = 'demo-bubble';
    return;
  }
  const st = STEPS[idx];
  document.querySelector(`.lane[data-lane="${st.lane}"]`).classList.add('active');
  bubble.textContent = st.bubble;
  bubble.className = 'demo-bubble' + (st.kind ? ' ' + st.kind : '');
}

function goto(i) {
  idx = Math.max(-1, Math.min(STEPS.length - 1, i));
  render();
}

function stopPlay() {
  playing = false;
  clearInterval(timer);
  btnPlay.textContent = '▶ Play';
}

btnNext.addEventListener('click', () => { stopPlay(); goto(idx + 1); });
btnPrev.addEventListener('click', () => { stopPlay(); goto(idx - 1); });
btnPlay.addEventListener('click', () => {
  if (playing) { stopPlay(); return; }
  if (idx >= STEPS.length - 1) idx = -1;
  playing = true;
  btnPlay.textContent = '❚❚ Pause';
  timer = setInterval(() => {
    if (idx >= STEPS.length - 1) { stopPlay(); return; }
    goto(idx + 1);
  }, 2300);
  goto(idx + 1);
});

render();
