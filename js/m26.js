// Módulo 26: eficiencia de la central y generador de Faraday
window.Dibujos = window.Dibujos || {};
Object.assign(window.Dibujos, {

  // Eficiencia: η = trabajo útil / calor de entrada
  eficiencia(el) {
    el.innerHTML = `
      <div class="row"><span class="note">Calor del reactor Q:</span>
        <input type="range" min="500" max="3000" step="100" value="3000" class="ef-q"><b class="note ef-qv">3000 MW</b></div>
      <div class="row"><span class="note">Eficiencia η:</span>
        <input type="range" min="20" max="45" value="33" class="ef-n"><b class="note ef-nv">33 %</b></div>
      <svg class="fig" viewBox="0 0 420 110">
        <rect x="20" y="30" width="380" height="36" rx="6" fill="#e9e2cf" stroke="#22314a" stroke-width="2"/>
        <rect class="ef-e" x="20" y="30" width="126" height="36" rx="6" fill="#3c8d5a" fill-opacity=".6"/>
        <text x="30" y="90" class="t" fill="#3c8d5a">electricidad</text>
        <text x="250" y="90" class="t" fill="#8a8170">calor perdido</text>
      </svg>
      <p class="note ef-t"></p>`;
    const q = el.querySelector('.ef-q'), n = el.querySelector('.ef-n'), bar = el.querySelector('.ef-e');
    function calc() {
      const Q = +q.value, eta = +n.value;
      const W = Q * eta / 100, perdido = Q - W;
      el.querySelector('.ef-qv').textContent = Q + ' MW';
      el.querySelector('.ef-nv').textContent = eta + ' %';
      bar.setAttribute('width', (380 * eta / 100).toFixed(1));
      el.querySelector('.ef-t').innerHTML =
        `W útil = η · Q = <span class="gr">${W.toFixed(0)} MW eléctricos</span>; ` +
        `el resto, <span class="hl">${perdido.toFixed(0)} MW</span>, se va como calor. ` +
        `Con eficiencia de aprox. 33 % una central de ese tamaño pierde dos tercios de su energía térmica.`;
    }
    q.addEventListener('input', calc);
    n.addEventListener('input', calc);
    calc();
  },

  // Generador de Faraday: φ = B A cos θ y Vem = −dφ/dt = B A ω sin θ
  generador(el) {
    const NS = 'http://www.w3.org/2000/svg';
    el.innerHTML = `
      <div class="row"><span class="note">Ángulo θ:</span>
        <input type="range" min="0" max="360" value="0" class="gn-a"><b class="note gn-av">0°</b></div>
      <svg class="fig" viewBox="0 0 420 220">
        <text x="20" y="20" class="t">N</text><text x="20" y="210" class="t">S</text>
        <g class="gn-loop" transform="rotate(0 120 110)">
          <rect x="70" y="85" width="100" height="50" fill="#f2c94c" fill-opacity=".4" stroke="#22314a" stroke-width="3"/>
        </g>
        <path d="M220 110 H400" stroke="#22314a" stroke-width="1" stroke-dasharray="4 6"/>
        <path class="gn-curva" fill="none" stroke="#c8432b" stroke-width="3"/>
        <circle class="gn-p" r="6" fill="#c8432b"/>
        <text x="220" y="30" class="t">Vem(θ)</text>
      </svg>
      <p class="note gn-t"></p>`;
    const a = el.querySelector('.gn-a'), loop = el.querySelector('.gn-loop'),
          curva = el.querySelector('.gn-curva'), p = el.querySelector('.gn-p');
    // trazo completo de la fem en el lado derecho
    let d = '';
    for (let x = 220; x <= 400; x += 2) {
      const th = (x - 220) / 180 * 2 * Math.PI;
      d += (x === 220 ? 'M' : 'L') + x + ' ' + (110 - 60 * Math.sin(th)).toFixed(1) + ' ';
    }
    curva.setAttribute('d', d);
    function calc() {
      const deg = +a.value, th = deg * Math.PI / 180;
      loop.setAttribute('transform', `rotate(${deg} 120 110)`);
      const phi = Math.cos(th);              // flujo normalizado (B A = 1)
      const emf = Math.sin(th);              // Vem normalizada (B A ω = 1)
      const x = 220 + deg / 360 * 180;
      p.setAttribute('cx', x.toFixed(1));
      p.setAttribute('cy', (110 - 60 * emf).toFixed(1));
      el.querySelector('.gn-av').textContent = deg + '°';
      el.querySelector('.gn-t').innerHTML =
        `Flujo φ = B A cos θ = <span class="bl">${phi.toFixed(2)}</span> (en unidades de B·A). ` +
        `Vem = −dφ/dt = B A ω sin θ = <span class="hl">${emf.toFixed(2)}</span>. ` +
        `Cuando el flujo cambia más rápido (θ = 90° o 270°), la fem es máxima.`;
    }
    a.addEventListener('input', calc);
    calc();
  }
});