// Módulo 22: penetración de α, β y γ
window.Dibujos = window.Dibujos || {};
// Widgets reutilizables. Cada función recibe un contenedor (elemento DOM) y lo llena.
Object.assign(window.Dibujos, {
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
});