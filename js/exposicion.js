document.addEventListener('DOMContentLoaded', () => {
  const scenes = document.querySelectorAll('.scene');
  const total = scenes.length;
  let idx = 0;

  const fill = document.getElementById('fill');
  const cnt = document.getElementById('cnt');

  function updateScene(n) {
    scenes[idx].classList.remove('on');
    idx = (n + total) % total;
    scenes[idx].classList.add('on');
    if (fill) fill.style.width = ((idx + 1) / total) * 100 + '%';
    if (cnt) cnt.textContent = `${idx + 1} / ${total}`;
  }

  // Navegación
  const btnNext = document.getElementById('next');
  const btnPrev = document.getElementById('prev');
  if (btnNext) btnNext.onclick = () => updateScene(idx + 1);
  if (btnPrev) btnPrev.onclick = () => updateScene(idx - 1);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') updateScene(idx + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') updateScene(idx - 1);
  });

  const btnFull = document.getElementById('full');
  if (btnFull) {
    btnFull.onclick = () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    };
  }

  const btnAnimar = document.getElementById('btnAnimar');
  if (btnAnimar) {
    btnAnimar.onclick = () => {
      window.open('assets/videos/animacion_materia_radiacion_nuclear.mp4', '_blank');
    };
  }

  // ==========================================
  // ESCENA 2: Radiación
  // ==========================================
  const mbtns = document.querySelectorAll('.mbtn');
  const ra = document.getElementById('r-a');
  const rb = document.getElementById('r-b');
  const rg = document.getElementById('r-g');
  const bar = document.getElementById('bar');
  const bartxt = document.getElementById('bartxt');
  const res = document.getElementById('res');

  const barreras = {
    papel: {
      h: 165, y: 30, txt: 'papel',
      alpha: 20, beta: 100, gamma: 100,
      msg: '<span class="gr">Atraviesan: β, γ</span> · <span class="hl">Se detienen: α</span>'
    },
    aluminio: {
      h: 100, y: 65, txt: 'aluminio',
      alpha: 20, beta: 60, gamma: 100,
      msg: '<span class="gr">Atraviesan: γ</span> · <span class="hl">Se detienen: α, β</span>'
    },
    plomo: {
      h: 30, y: 95, txt: 'plomo',
      alpha: 20, beta: 30, gamma: 50,
      msg: '<span class="gr">Atraviesan: solo una fracción de γ</span> · <span class="hl">Se detienen: α, β (γ se atenúa, no se elimina)</span>'
    }
  };

  mbtns.forEach(btn => {
    btn.onclick = () => {
      mbtns.forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      const b = barreras[btn.getAttribute('data-m')];
      if (bar) { bar.setAttribute('height', b.h); bar.setAttribute('y', b.y); }
      if (bartxt) bartxt.textContent = b.txt;
      if (ra) ra.setAttribute('d', `M 60 110 H ${60 + b.alpha}`);
      if (rb) rb.setAttribute('d', `M 60 110 H ${60 + b.beta}`);
      if (rg) rg.setAttribute('d', `M 60 110 H ${60 + b.gamma}`);
      if (res) res.innerHTML = b.msg;
    };
  });
  if (mbtns.length > 0) mbtns[0].click();

  // ==========================================
  // ESCENA 3: Fisión (una sola declaración)
  // ==========================================
  const fis = document.getElementById('fis');
  const fire = document.getElementById('fire');
  const fres = document.getElementById('fres');
  const ftxt = document.getElementById('ftxt');
  const MAX_DRAW = 32;
  let gen = 0;
  let current = 1;

  // Cada neutrón parte un núcleo y libera 2 o 3 neutrones
  function fissionsFrom(n) {
    if (n > 200000) return Math.round(n * 2.5);
    let total = 0;
    for (let i = 0; i < n; i++) total += Math.random() < 0.5 ? 2 : 3;
    return total;
  }

  function drawFission() {
    if (!fis) return;
    const plural = current === 1 ? '' : 'es';
    let s = `<text x="10" y="24" class="t">Generación ${gen}: ${current.toLocaleString('es')} neutrón${plural}</text>`;
    const shown = Math.min(current, MAX_DRAW);
    for (let i = 0; i < shown; i++) {
      const cx = 40 + (i % 8) * 62;
      const cy = 60 + Math.floor(i / 8) * 36;
      s += `<circle cx="${cx}" cy="${cy}" r="12" fill="#c8432b" fill-opacity=".3" stroke="#22314a" stroke-width="2"/>`;
      s += `<text x="${cx - 4}" y="${cy + 5}" class="t" style="font-size:15px">n</text>`;
    }
    if (current > MAX_DRAW) {
      s += `<text x="40" y="165" class="t">… +${(current - MAX_DRAW).toLocaleString('es')} neutrones más</text>`;
    }
    fis.innerHTML = s;
  }

  if (fire) {
    fire.onclick = () => {
      const prev = current;
      current = fissionsFrom(current);
      gen++;
      drawFission();
      const k = current / prev;
      if (ftxt) ftxt.textContent = `Cada neutrón partió un núcleo y liberó 2 o 3 nuevos. k ≈ ${k.toFixed(2)} en esta generación.`;
    };
  }
  if (fres) {
    fres.onclick = () => {
      gen = 0;
      current = 1;
      drawFission();
      if (ftxt) ftxt.textContent = 'Un neutrón entra a un núcleo de U-235 e inicia la primera fisión.';
    };
  }
  drawFission();

  // ==========================================
  // ESCENA 5: Bomba vs reactor (barras de control)
  // ==========================================
  const rod = document.getElementById('rod');
  const rodv = document.getElementById('rodv');
  const rod1 = document.getElementById('rod1');
  const rod2 = document.getElementById('rod2');
  const kt = document.getElementById('kt');
  const ktxt = document.getElementById('ktxt');

  function updateReactor(val) {
    const v = Number(val);
    if (rodv) rodv.textContent = v + '%';
    const h = (v / 100) * 110;
    if (rod1) rod1.setAttribute('height', 10 + h);
    if (rod2) rod2.setAttribute('height', 10 + h);

    // k baja linealmente al insertar barras
    const k = Math.max(0, 2.5 * (1 - v / 100));
    if (kt) kt.textContent = `k = ${k.toFixed(2)}`;

    if (ktxt) {
      if (k > 1.02) ktxt.textContent = 'Supercrítico (k > 1): la potencia crece. En un reactor el crecimiento se controla; en una bomba es casi instantáneo.';
      else if (k >= 0.98) ktxt.textContent = 'Crítico (k ≈ 1): la potencia se mantiene constante. Es el estado normal de operación.';
      else ktxt.textContent = 'Subcrítico (k < 1): la reacción se apaga con el tiempo.';
    }
  }
  if (rod) {
    rod.oninput = (e) => updateReactor(e.target.value);
    updateReactor(rod.value);
  }

  // ==========================================
  // ESCENA 6: Reactor como máquina de vapor
  // ==========================================
  const rOn = document.getElementById('rOn');
  const vap = document.getElementById('vap');
  const blades = document.getElementById('blades');
  const bulbg = document.getElementById('bulbg');
  let reactorEncendido = false;

  if (vap) vap.style.display = 'none';
  if (blades) blades.classList.remove('go');
  if (bulbg) bulbg.style.opacity = '0';

  if (rOn) {
    rOn.onclick = () => {
      reactorEncendido = !reactorEncendido;
      if (reactorEncendido) {
        rOn.textContent = 'Apagar reactor';
        rOn.style.background = 'var(--green)';
        if (vap) vap.style.display = 'block';
        if (blades) blades.classList.add('go');
        if (bulbg) bulbg.style.opacity = '1';
      } else {
        rOn.textContent = 'Encender reactor';
        rOn.style.background = 'var(--red)';
        if (vap) vap.style.display = 'none';
        if (blades) blades.classList.remove('go');
        if (bulbg) bulbg.style.opacity = '0';
      }
    };
  }

  // ==========================================
  // TOOLTIP al pasar el mouse (elementos con data-tip)
  // ==========================================
  const tip = document.getElementById('tip');
  function moveTip(e) {
    if (!tip) return;
    tip.style.left = (e.clientX + 16) + 'px';
    tip.style.top = (e.clientY + 16) + 'px';
  }
  function showTip(text, e) {
    if (!tip) return;
    tip.textContent = text;
    tip.style.display = 'block';
    moveTip(e);
  }
  function hideTip() {
    if (tip) tip.style.display = 'none';
  }
  document.querySelectorAll('[data-tip]').forEach(el => {
    el.addEventListener('pointerenter', e => showTip(el.dataset.tip, e));
    el.addEventListener('pointermove', moveTip);
    el.addEventListener('pointerleave', hideTip);
  });

  // ==========================================
  // ESCENA 7: Medicina
  // ==========================================
  const cards = document.querySelectorAll('#cards .card');
  const medsvg = document.getElementById('medsvg');
  const medtxt = document.getElementById('medtxt');

  const medData = {
    diag: { txt: 'Rayos X y TAC: permiten ver el interior del cuerpo mediante absorción diferencial de radiación.', svg: '<circle cx="210" cy="110" r="60" fill="none" stroke="#2f6fb0" stroke-width="4"/><text x="175" y="115" class="t">Rayos X</text>' },
    rad: { txt: 'Radioterapia: usa haces de alta energía para destruir células tumorales localizadas.', svg: '<rect x="150" y="80" width="120" height="60" rx="10" fill="none" stroke="#c8432b" stroke-width="4"/><text x="170" y="115" class="t">Tumor</text>' },
    tir: { txt: 'Yodo-131: se acumula en la tiroides para tratar hipertiroidismo o cáncer de tiroides.', svg: '<path d="M180 90 Q210 130 240 90 Q250 150 210 160 Q170 150 180 90" fill="#3c8d5a" fill-opacity=".3" stroke="#3c8d5a" stroke-width="3"/><text x="195" y="125" class="t">I-131</text>' },
    ester: { txt: 'Esterilización por radiación gamma: elimina gérmenes en material médico sin calor.', svg: '<rect x="160" y="70" width="100" height="80" fill="none" stroke="#22314a" stroke-width="3" stroke-dasharray="6"/><text x="185" y="115" class="t">Gamma</text>' }
  };

  cards.forEach(card => {
    card.onclick = () => {
      cards.forEach(c => c.classList.remove('sel'));
      card.classList.add('sel');
      const d = medData[card.getAttribute('data-k')];
      if (medsvg) medsvg.innerHTML = d.svg;
      if (medtxt) medtxt.textContent = d.txt;
    };
  });
  if (cards.length > 0) cards[0].click();

  // ==========================================
  // ESCENA 8: Fórmulas
  // ==========================================
  const mass = document.getElementById('mass');
  const massv = document.getElementById('massv');
  const eout = document.getElementById('eout');
  const util = document.getElementById('util');
  const utilv = document.getElementById('utilv');
  const effbar = document.getElementById('effbar');
  const eff = document.getElementById('eff');

  function updateFormulas() {
    if (mass && massv && eout) {
      const m = parseFloat(mass.value);
      massv.textContent = m + ' g';
      eout.textContent = `Equivalente en energía: ~${(m * 9e13).toExponential(2)} Joules`;
    }
    if (util && utilv && effbar && eff) {
      const u = parseInt(util.value);
      utilv.textContent = u + ' J';
      effbar.style.width = u + '%';
      eff.textContent = u + '%';
    }
  }
  if (mass) mass.oninput = updateFormulas;
  if (util) util.oninput = updateFormulas;
  updateFormulas();

  // ==========================================
  // ESCENA 9: Repaso
  // ==========================================
  document.querySelectorAll('.item').forEach(item => {
    item.onclick = () => item.classList.toggle('on');
  });

  // ==========================================
  // ESCENA 10: Preguntas tipo parcial
  // ==========================================
  const quizContainer = document.getElementById('quiz');
  if (quizContainer) {
    const preguntas = [
      {
        q: "1. ¿Qué tipo de radiación es detenida por una simple hoja de papel?",
        options: ["Partículas Alfa (α)", "Partículas Beta (β)", "Rayos Gamma (γ)"],
        correct: 0,
        exp: "La respuesta correcta es alfa: son núcleos de helio, grandes y pesados, y el papel los frena por completo."
      },
      {
        q: "2. ¿Cuál es la función principal de las barras de control en un reactor nuclear?",
        options: [
          "Acelerar la fisión nuclear",
          "Absorber neutrones para mantener la reacción estable (k ≈ 1)",
          "Convertir el vapor en electricidad directamente"
        ],
        correct: 1,
        exp: "La respuesta correcta es absorber neutrones: así se evita que la reacción en cadena se desboque."
      },
      {
        q: "3. ¿Por qué un reactor nuclear se considera una 'máquina de vapor'?",
        options: [
          "Porque no utiliza agua en su proceso",
          "Porque la fisión genera calor para hervir agua, mover una turbina y un generador",
          "Porque funciona con carbón enriquecido"
        ],
        correct: 1,
        exp: "La respuesta correcta es la del calor que hierve agua: el núcleo solo es la fuente de calor, y el resto del ciclo es igual al de una central térmica clásica."
      }
    ];

    let quizHTML = '';
    preguntas.forEach((p, pIdx) => {
      quizHTML += `<div style="margin-bottom: 20px; background: #fff8; border: 2px dashed var(--ink); border-radius: 12px; padding: 14px;">
        <p class="note" style="font-weight:700;">${p.q}</p>`;
      p.options.forEach((opt, oIdx) => {
        quizHTML += `<button class="btn q-btn" data-p="${pIdx}" data-o="${oIdx}" style="display:block; margin:6px 0; width:100%; text-align:left;">${opt}</button>`;
      });
      quizHTML += `<p class="note q-exp" id="exp-${pIdx}" style="margin-top:8px; font-style:italic; display:none;"></p></div>`;
    });
    quizContainer.innerHTML = quizHTML;

    quizContainer.querySelectorAll('.q-btn').forEach(btn => {
      btn.onclick = () => {
        const pIdx = btn.getAttribute('data-p');
        const oIdx = parseInt(btn.getAttribute('data-o'));
        const p = preguntas[pIdx];
        const expBox = document.getElementById(`exp-${pIdx}`);
        const siblings = quizContainer.querySelectorAll(`[data-p="${pIdx}"]`);

        siblings.forEach(s => {
          s.style.opacity = '0.6';
          s.style.pointerEvents = 'none';
        });

        if (oIdx === p.correct) {
          btn.style.background = 'var(--green)';
          btn.style.color = '#fff';
        } else {
          btn.style.background = 'var(--red)';
          btn.style.color = '#fff';
          siblings[p.correct].style.background = 'var(--green)';
          siblings[p.correct].style.color = '#fff';
        }

        if (expBox) {
          expBox.style.display = 'block';
          expBox.textContent = p.exp;
        }
      };
    });
  }

  // Inicializar
  updateScene(0);
}); 