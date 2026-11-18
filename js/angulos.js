const CX = 200, CY = 200, R = 150;

const N = [
  {d:0,  rad:'0',   s:'0',     c:'1',    t:'0'},
  {d:30, rad:'π/6', s:'1/2',   c:'√3/2', t:'√3/3'},
  {d:45, rad:'π/4', s:'√2/2',  c:'√2/2', t:'1'},
  {d:60, rad:'π/3', s:'√3/2',  c:'1/2',  t:'√3'},
  {d:90, rad:'π/2', s:'1',     c:'0',    t:'no definida'}
];

let ang = 0;
let dragging = false;

const $ = id => document.getElementById(id);
const exactAt = a => N.find(n => n.d === a);
const crear = (tag, attrs = {}, html = '') => {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  el.innerHTML = html;
  return el;
};

/* ---------- Círculo ---------- */
function render() {
  const r = ang * Math.PI / 180;
  const cs = Math.cos(r), sn = Math.sin(r);
  const tn = Math.abs(cs) < 1e-9 ? null : sn / cs;
  const px = CX + R * cs, py = CY - R * sn;

  let h = '';
  h += `<line x1="${CX}" y1="${CY}" x2="${px}" y2="${py}" stroke="#1f2937" stroke-width="2.5"/>`;
  h += `<line x1="${px}" y1="${py}" x2="${px}" y2="${CY}" stroke="#2f6fb0" stroke-width="3" stroke-dasharray="6 5"/>`;
  h += `<line x1="${px}" y1="${py}" x2="${CX}" y2="${py}" stroke="#3c8d5a" stroke-width="3" stroke-dasharray="6 5"/>`;
  if (tn !== null && cs > 1e-9) {
    const tc = Math.max(-3, Math.min(3, tn));
    const ty = CY - R * tc;
    h += `<line x1="${CX+R}" y1="${CY}" x2="${CX+R}" y2="${ty}" stroke="#c8432b" stroke-width="4"/>`;
    h += `<line x1="${CX}" y1="${CY}" x2="${CX+R}" y2="${ty}" stroke="#c8432b" stroke-width="1.5" stroke-dasharray="3 4"/>`;
  }
  h += `<text x="${px+10}" y="${(py+CY)/2}" font-size="15" fill="#2f6fb0" font-weight="700">sen</text>`;
  h += `<text x="${(px+CX)/2-8}" y="${py-8}" font-size="15" fill="#3c8d5a" font-weight="700">cos</text>`;
  h += `<circle cx="${px}" cy="${py}" r="9" fill="#c8432b" stroke="#fff" stroke-width="2"/>`;
  h += `<text x="${px+12}" y="${py-12}" font-size="15" fill="#1f2937" font-weight="700">${ang}°</text>`;
  $('dyn').innerHTML = h;

  const ex = exactAt(ang);
  $('deg').textContent = ang + '°';
  $('rad').textContent = 'Radianes: ' + (ex ? ex.rad : (ang * Math.PI / 180).toFixed(3));
  $('vs').textContent = ex ? ex.s : sn.toFixed(3);
  $('vc').textContent = ex ? ex.c : cs.toFixed(3);
  $('vt').textContent = ex ? ex.t : (tn === null ? 'no definida' : tn.toFixed(3));

  document.querySelectorAll('[data-ang]').forEach(b =>
    b.classList.toggle('sel', +b.dataset.ang === ang));
  document.querySelectorAll('tr.fila').forEach(tr =>
    tr.classList.toggle('sel', +tr.dataset.ang === ang));
  document.querySelectorAll('.sq [data-col]').forEach(c =>
    c.classList.toggle('hi', +c.dataset.col === ang));
  $('slider').value = ang;
}

function setAng(a) { ang = a; render(); }

function desdeEvento(e) {
  const rect = $('circ').getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width * 400;
  const y = (e.clientY - rect.top) / rect.height * 400;
  let a = Math.atan2(CY - y, x - CX) * 180 / Math.PI;
  if (a < 0) a += 360;
  a = Math.round(a);
  for (const n of N) if (Math.abs(a - n.d) <= 3) a = n.d; // imán
  if (a === 360) a = 0;
  setAng(a);
}

$('circ').addEventListener('pointerdown', e => {
  dragging = true;
  $('circ').setPointerCapture(e.pointerId);
  desdeEvento(e);
});
$('circ').addEventListener('pointermove', e => { if (dragging) desdeEvento(e); });
$('circ').addEventListener('pointerup', () => dragging = false);
$('circ').addEventListener('pointercancel', () => dragging = false);

$('slider').addEventListener('input', e => setAng(+e.target.value));

N.forEach(n => {
  const b = crear('button', { 'data-ang': n.d }, `${n.d}°`);
  b.onclick = () => setAng(n.d);
  $('btns').appendChild(b);
});

/* ---------- Tabla ---------- */
N.forEach(n => {
  const tr = crear('tr', { class: 'fila', 'data-ang': n.d },
    `<td><b>${n.d}°</b></td><td>${n.rad}</td><td>${n.s}</td><td>${n.c}</td><td>${n.t}</td>`);
  tr.onclick = () => setAng(n.d);
  $('tbody').appendChild(tr);
});

/* ---------- Truco de la raíz ---------- */
(function construirSq() {
  const sq = $('sq');
  const celda = (html, cls = '', attrs = {}) => {
    const d = crear('div', cls ? { class: cls, ...attrs } : attrs, html);
    sq.appendChild(d);
    return d;
  };
  celda('Ángulo', 'lbl');
  N.forEach(n => celda(n.d + '°', '', { 'data-col': n.d }).onclick = () => setAng(n.d));
  celda('n', 'lbl');
  [0,1,2,3,4].forEach(k => celda(String(k)));
  celda('sen θ = √n / 2', 'lbl');
  [0,1,2,3,4].forEach(k => celda(`√${k}/2`));
  celda('cos θ = √(4−n) / 2', 'lbl');
  [0,1,2,3,4].forEach(k => celda(`√${4-k}/2`));
})();

/* ---------- Reto ---------- */
let score = 0, total = 0, cur = null;

function barajar(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function nuevaPregunta() {
  const n = N[Math.floor(Math.random() * N.length)];
  const f = ['sen', 'cos', 'tan'][Math.floor(Math.random() * 3)];
  const clave = { sen: 's', cos: 'c', tan: 't' }[f];
  const correcta = n[clave];
  const otras = barajar([...new Set(N.map(x => x[clave]))].filter(v => v !== correcta));
  const ops = barajar([correcta, ...otras.slice(0, 3)]);
  cur = { correcta, answered: false };

  $('q').textContent = `¿Cuánto vale ${f}(${n.d}°)?`;
  $('opts').innerHTML = '';
  ops.forEach(v => {
    const b = crear('button', {}, v);
    b.onclick = () => responder(b, v);
    $('opts').appendChild(b);
  });
  $('fb').textContent = '';
  $('fb').className = 'fb';
  $('next').hidden = true;
}

function responder(btn, v) {
  if (cur.answered) return;
  cur.answered = true;
  total++;
  const ok = v === cur.correcta;
  if (ok) score++;
  btn.classList.add(ok ? 'good' : 'wrong');
  [...$('opts').children].forEach(b => {
    b.disabled = true;
    if (b.textContent === cur.correcta) b.classList.add('good');
  });
  $('fb').textContent = ok ? '¡Correcto!' : `No. La respuesta es ${cur.correcta}.`;
  $('fb').className = 'fb ' + (ok ? 'ok' : 'bad');
  $('score').textContent = `Aciertos: ${score} de ${total}`;
  $('next').hidden = false;
}

$('next').onclick = nuevaPregunta;

/* ---------- Inicio ---------- */
render();
nuevaPregunta();