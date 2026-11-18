// Módulo 25: niveles de Bohr y desviación de electrones
window.Dibujos = window.Dibujos || {};
Object.assign(window.Dibujos, {

  // Modelo de Bohr: niveles de energía y longitud de onda de la transición
  // 1/λ = R (1/nf² − 1/ni²), con R ≈ 1.097 × 10⁷ m⁻¹
  bohr(el) {
    const R = 1.097e7;
    const NS = 'http://www.w3.org/2000/svg';
    const Y = n => 220 - 200 * (1 - 1 / (n * n));
    let nf = 2;
    el.innerHTML = `
      <div class="row"><span class="note">Estado final n<sub>f</sub>:</span>
        <button class="btn nfb" data-nf="1">1 (ultravioleta)</button>
        <button class="btn nfb sel" data-nf="2">2 (visible, serie de Balmer)</button></div>
      <svg class="fig" viewBox="0 0 420 250"><g class="bo-g"></g></svg>
      <p class="note bo-t">Toca un nivel n<sub>i</sub> para ver el fotón que emite el electrón al bajar a n<sub>f</sub>.</p>`;
    const g = el.querySelector('.bo-g');
    function niveles() {
      g.innerHTML = '';
      for (let n = 1; n <= 6; n++) {
        const y = Y(n);
        const l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', 80); l.setAttribute('x2', 300); l.setAttribute('y1', y); l.setAttribute('y2', y);
        l.setAttribute('stroke', '#22314a'); l.setAttribute('stroke-width', 3);
        g.appendChild(l);
        const t = document.createElementNS(NS, 'text');
        t.setAttribute('x', 40); t.setAttribute('y', y + 6); t.setAttribute('class', 't'); t.textContent = 'n=' + n;
        g.appendChild(t);
        const hit = document.createElementNS(NS, 'rect');
        hit.setAttribute('x', 70); hit.setAttribute('y', y - 14); hit.setAttribute('width', 240); hit.setAttribute('height', 28);
        hit.setAttribute('fill', 'transparent'); hit.style.cursor = 'pointer';
        hit.addEventListener('click', () => emitir(n));
        g.appendChild(hit);
      }
    }
    function colorDe(lam) {
      if (lam < 380) return ['ultravioleta', '#7a4fb0'];
      if (lam < 450) return ['violeta', '#8a4fd0'];
      if (lam < 495) return ['azul', '#2f6fb0'];
      if (lam < 570) return ['verde', '#3c8d5a'];
      if (lam < 750) return ['rojo', '#c8432b'];
      return ['infrarrojo', '#8a8170'];
    }
    function emitir(ni) {
      if (ni <= nf) { el.querySelector('.bo-t').textContent = 'Elige un nivel más alto que n = ' + nf + '.'; return; }
      niveles();
      const flecha = document.createElementNS(NS, 'line');
      flecha.setAttribute('x1', 320); flecha.setAttribute('x2', 320);
      flecha.setAttribute('y1', Y(ni)); flecha.setAttribute('y2', Y(nf));
      flecha.setAttribute('stroke', '#c8432b'); flecha.setAttribute('stroke-width', 3);
      g.appendChild(flecha);
      const lamNm = 1e9 / (R * (1 / (nf * nf) - 1 / (ni * ni)));
      const [nombre, col] = colorDe(lamNm);
      const tx = document.createElementNS(NS, 'text');
      tx.setAttribute('x', 335); tx.setAttribute('y', (Y(ni) + Y(nf)) / 2 + 6);
      tx.setAttribute('class', 't'); tx.setAttribute('fill', col);
      tx.textContent = Math.round(lamNm) + ' nm';
      g.appendChild(tx);
      el.querySelector('.bo-t').innerHTML =
        `Transición n=${ni} → n=${nf}: <span class="hl">λ ≈ ${Math.round(lamNm)} nm</span> (${nombre}). ` +
        `Energía del fotón E = hf, igual a la diferencia entre los dos niveles.`;
    }
    el.querySelectorAll('.nfb').forEach(b => b.addEventListener('click', () => {
      nf = +b.dataset.nf;
      el.querySelectorAll('.nfb').forEach(x => x.classList.toggle('sel', x === b));
      niveles();
      el.querySelector('.bo-t').textContent = 'Toca un nivel n_i para ver el fotón al bajar a n = ' + nf + '.';
    }));
    niveles();
  },

  // Rayos catódicos: la fuerza magnética F = q v B sen θ desvía el haz
  desviacion(el) {
    const NS = 'http://www.w3.org/2000/svg';
    el.innerHTML = `
      <div class="row"><span class="note">Campo magnético B:</span>
        <input type="range" min="0" max="10" value="5" class="dv-b"><span class="cont dv-v">5</span></div>
      <svg class="fig" viewBox="0 0 340 220">
        <line x1="20" y1="120" x2="320" y2="120" stroke="#22314a" stroke-width="1" stroke-dasharray="4 6"/>
        <rect x="300" y="30" width="16" height="180" fill="#e9e2cf" stroke="#22314a" stroke-width="2"/>
        <text x="260" y="25" class="t">pantalla</text>
        <path class="dv-p" d="M20 120 Q 160 120 300 120" stroke="#c8432b" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle class="dv-e" cx="300" cy="120" r="6" fill="#c8432b"/>
      </svg>
      <p class="note dv-t"></p>`;
    const b = el.querySelector('.dv-b'), p = el.querySelector('.dv-p'), e = el.querySelector('.dv-e');
    function dibujar() {
      const B = +b.value;
      const d = B * 6;                  // desviación en el extremo (escala visual)
      const yEnd = 120 - B * 10;         // el haz se curva hacia arriba (dentro de la vista)
      p.setAttribute('d', `M20 120 Q 160 120 300 ${yEnd}`);
      e.setAttribute('cy', yEnd);
      el.querySelector('.dv-v').textContent = B;
      el.querySelector('.dv-t').innerHTML =
        `F = q v B sen θ: con B = 0 el haz sigue recto; a mayor campo, mayor desviación. ` +
        `Si el campo es perpendicular a la velocidad (θ = 90°), sen θ = 1 y la fuerza es máxima.`;
    }
    b.addEventListener('input', dibujar);
    dibujar();
  }
});