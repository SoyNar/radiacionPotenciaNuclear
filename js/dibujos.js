// Widgets reutilizables. Cada función recibe un contenedor (elemento DOM) y lo llena.
window.Dibujos = {
  penetracion(el) {
    const MAT = {
      papel:    { x: 170, c: '#e8d9b0', s: ['a'] },
      aluminio: { x: 235, c: '#b9c6d3', s: ['a', 'b'] },
      plomo:    { x: 300, c: '#6b6b78', s: ['a', 'b', 'g'] }
    };
    const RAYS = [
      { id: 'a', n: 'α', y: 90,  amp: 0, col: '#c8432b', w: 5 },
      { id: 'b', n: 'β', y: 130, amp: 5, col: '#2f6fb0', w: 3 },
      { id: 'g', n: 'γ', y: 170, amp: 9, col: '#3c8d5a', w: 3 }
    ];
    const NS = 'http://www.w3.org/2000/svg';

    el.innerHTML = `
      <div class="row">${Object.keys(MAT).map(k =>
        `<button class="btn mbtn" data-m="${k}">${k}</button>`).join('')}</div>
      <svg class="fig" viewBox="0 0 420 210"><g id="pen-g"></g></svg>
      <p class="note res"></p>`;

    const g = el.querySelector('#pen-g');
    RAYS.forEach(r => {
      let d = `M90 ${r.y}`;
      for (let x = 94; x <= 400; x += 4) d += ` L${x} ${(r.y + r.amp * Math.sin(x / 5)).toFixed(1)}`;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('pathLength', '100');
      p.setAttribute('stroke', r.col);
      p.setAttribute('stroke-width', r.w);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke-linecap', 'round');
      p.dataset.id = r.id;
      g.appendChild(p);
    });
    const nucleo = document.createElementNS(NS, 'circle');
    nucleo.setAttribute('cx', 60); nucleo.setAttribute('cy', 110); nucleo.setAttribute('r', 26);
    nucleo.setAttribute('fill', '#c8432b'); nucleo.setAttribute('fill-opacity', '.2');
    g.prepend(nucleo);
    const bar = document.createElementNS(NS, 'rect');
    bar.setAttribute('y', 30); bar.setAttribute('width', 12); bar.setAttribute('height', 165);
    bar.setAttribute('rx', 2); bar.setAttribute('stroke', '#22314a'); bar.setAttribute('stroke-width', 2);
    g.appendChild(bar);
    const etiqueta = document.createElementNS(NS, 'text');
    etiqueta.setAttribute('class', 't'); etiqueta.setAttribute('y', 25);
    g.appendChild(etiqueta);

    function aplicar(k) {
      const M = MAT[k];
      bar.setAttribute('x', M.x - 6);
      bar.setAttribute('fill', M.c);
      etiqueta.setAttribute('x', M.x - 22);
      etiqueta.textContent = k;
      const pasan = [], paran = [];
      RAYS.forEach(r => {
        const hit = M.s.includes(r.id);
        g.querySelector(`[data-id="${r.id}"]`)
          .setAttribute('stroke-dasharray', (hit ? (M.x - 90) / 310 * 100 : 100).toFixed(1) + ' 100');
        (hit ? paran : pasan).push(r.n);
      });
      el.querySelector('.res').innerHTML =
        `<span class="gr">Atraviesan: ${pasan.length ? pasan.join(', ') : 'ninguna'}</span> · ` +
        `<span class="hl">Se detienen: ${paran.join(', ')}</span>`;
      el.querySelectorAll('.mbtn').forEach(b => b.classList.toggle('sel', b.dataset.m === k));
    }
    el.querySelectorAll('.mbtn').forEach(b => b.addEventListener('click', () => aplicar(b.dataset.m)));
    aplicar('papel');
  }
};

// ---- Módulo 23: estructura de la materia ----
Object.assign(window.Dibujos, {

  // Ley de Lavoisier (la materia se conserva) y Dalton (proporciones enteras)
  conservacion(el) {
    const C = {
      agua:  { nombre: 'H₂O (agua)',           H: 2, O: 1 },
      agua2: { nombre: 'H₂O₂ (agua oxigenada)', H: 2, O: 2 }
    };
    const NS = 'http://www.w3.org/2000/svg';
    el.innerHTML = `
      <div class="row">${Object.keys(C).map(k => `<button class="btn cbtn" data-c="${k}">${C[k].nombre}</button>`).join('')}</div>
      <svg class="fig" viewBox="0 0 420 150"><g id="cons-g"></g></svg>
      <p class="note res"></p>`;
    const g = el.querySelector('#cons-g');
    function atomo(x, y, col, lab) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 18);
      c.setAttribute('fill', col); c.setAttribute('fill-opacity', '.35');
      c.setAttribute('stroke', col); c.setAttribute('stroke-width', 2);
      g.appendChild(c);
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x - 6); t.setAttribute('y', y + 6); t.setAttribute('class', 't'); t.textContent = lab;
      g.appendChild(t);
    }
    function dibujar(k) {
      const c = C[k]; g.innerHTML = '';
      // reactivos: 2 H2 + O2 (izquierda)  →  producto (derecha)
      for (let i = 0; i < 2; i++) { atomo(40 + i * 40, 40, '#2f6fb0', 'H'); }
      atomo(40, 100, '#c8432b', 'O'); atomo(80, 100, '#c8432b', 'O');
      const flecha = document.createElementNS(NS, 'text');
      flecha.setAttribute('x', 175); flecha.setAttribute('y', 80); flecha.setAttribute('class', 't'); flecha.textContent = '→';
      g.appendChild(flecha);
      for (let i = 0; i < c.H; i++) atomo(230 + i * 40, 40, '#2f6fb0', 'H');
      for (let i = 0; i < c.O; i++) atomo(230 + i * 40, 100, '#c8432b', 'O');
      el.querySelectorAll('.cbtn').forEach(b => b.classList.toggle('sel', b.dataset.c === k));
      const ratio = (c.H / c.O).toFixed(1).replace('.0', '');
      el.querySelector('.res').innerHTML =
        `Cada molécula tiene ${c.H} H y ${c.O} O. La proporción H:O es ${ratio}:1, un número entero (ley de Dalton). ` +
        `<span class="gr">Lavoisier:</span> en la reacción los átomos solo se reacomodan; no se pierden.`;
    }
    el.querySelectorAll('.cbtn').forEach(b => b.addEventListener('click', () => dibujar(b.dataset.c)));
    dibujar('agua');
  },

  // Pila de Volta: placas apiladas. Más capas = más voltaje (se suman).
  pilaVolta(el) {
    el.innerHTML = `
      <div class="row"><span class="note">Capas:</span><input type="range" min="1" max="10" value="3" class="pv-n"><span class="cont pv-v">3</span></div>
      <svg class="fig" viewBox="0 0 300 260"><g class="pv-g"></g></svg>
      <p class="note pv-t"></p>`;
    const n = el.querySelector('.pv-n'), g = el.querySelector('.pv-g');
    const NS = 'http://www.w3.org/2000/svg';
    function dibujar() {
      const k = +n.value;
      el.querySelector('.pv-v').textContent = k;
      g.innerHTML = '';
      for (let i = 0; i < k; i++) {
        const y = 210 - i * 18;
        const cu = document.createElementNS(NS, 'rect');
        cu.setAttribute('x', 110); cu.setAttribute('y', y); cu.setAttribute('width', 80); cu.setAttribute('height', 10);
        cu.setAttribute('fill', '#c98b4b'); cu.setAttribute('class', 'capa');
        g.appendChild(cu);
        const cart = document.createElementNS(NS, 'rect');
        cart.setAttribute('x', 110); cart.setAttribute('y', y + 10); cart.setAttribute('width', 80); cart.setAttribute('height', 6);
        cart.setAttribute('fill', '#b8c4a0');
        g.appendChild(cart);
      }
      el.querySelector('.pv-t').innerHTML =
        `Con ${k} capa${k > 1 ? 's' : ''} el voltaje es <span class="hl">${k} veces el de una sola</span>, porque los voltajes de cada par se suman. ` +
        `Así se obtuvieron corrientes apreciables a partir de una sola capa de muy baja intensidad.`;
    }
    n.addEventListener('input', dibujar);
    dibujar();
  },

  // Electrólisis del agua: por cada 2 H2 sale 1 O2 (volumen 2:1)
  electrolisis(el) {
    el.innerHTML = `
      <div class="row"><button class="btn ebtn">▶ Pasar corriente</button><button class="btn erst">↺ Reiniciar</button></div>
      <svg class="fig" viewBox="0 0 420 240">
        <rect x="60" y="40" width="40" height="160" fill="none" stroke="#22314a" stroke-width="3"/>
        <rect x="320" y="40" width="40" height="160" fill="none" stroke="#22314a" stroke-width="3"/>
        <rect x="60" y="120" width="300" height="80" fill="#b9d6ec" fill-opacity=".5" stroke="#22314a" stroke-width="2"/>
        <text x="40" y="30" class="t">Oxígeno (O₂)</text>
        <text x="300" y="30" class="t">Hidrógeno (H₂)</text>
        <g class="eg"></g>
      </svg>
      <p class="note eres"></p>`;
    const NS = 'http://www.w3.org/2000/svg';
    const eg = el.querySelector('.eg'); let h = 0, o = 0, timer = null;
    function pintar() {
      el.querySelector('.eres').innerHTML =
        `H₂: <span class="bl">${h}</span> · O₂: <span class="hl">${o}</span> ` +
        `${h ? '· proporción ' + h + ' : ' + o + ' (se acerca a 2 : 1)' : ''}`;
    }
    function burbuja(x, col) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', 190); c.setAttribute('r', 6);
      c.setAttribute('fill', col); c.setAttribute('fill-opacity', '.5');
      c.setAttribute('class', 'burbuja'); eg.appendChild(c);
      setTimeout(() => c.remove(), 2500);
    }
    el.querySelector('.ebtn').addEventListener('click', () => {
      if (timer) return;
      timer = setInterval(() => {
        // dos burbujas de H₂ por cada una de O₂
        burbuja(330 + Math.random() * 20, '#2f6fb0'); h++;
        burbuja(330 + Math.random() * 20, '#2f6fb0'); h++;
        burbuja(70 + Math.random() * 20, '#c8432b'); o++;
        pintar();
        if (h >= 20) { clearInterval(timer); timer = null; }
      }, 500);
    });
    el.querySelector('.erst').addEventListener('click', () => {
      clearInterval(timer); timer = null; h = 0; o = 0; eg.innerHTML = ''; pintar();
    });
    pintar();
  }
});

// ---- Módulo 25: modelos atómicos ----
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
      const yEnd = 120 - d * 4;          // el haz se curva hacia arriba
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