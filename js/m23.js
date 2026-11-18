// Módulo 23: conservación, pila de Volta, electrólisis
window.Dibujos = window.Dibujos || {};
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