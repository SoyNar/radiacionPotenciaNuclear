// Módulo 27: conservación de la energía, entropía y la utopía del móvil perpetuo
window.Dibujos = window.Dibujos || {};
Object.assign(window.Dibujos, {

  // 1) Péndulo con fricción: la energía mecánica se conserva en total,
  //    pero pasa a energía térmica. E_k + E_p + Q = E_0 (m = L = 1, g = 9,8)
  penduloFriccion(el) {
    const G = 9.8;
    el.innerHTML = `
      <div class="row"><span class="note">Ángulo inicial:</span>
        <input type="range" min="10" max="80" value="60" class="pf-a"><b class="note pf-av">60°</b></div>
      <div class="row"><span class="note">Fricción b:</span>
        <input type="range" min="0" max="1.5" step="0.1" value="0.4" class="pf-b"><b class="note pf-bv">0.4</b></div>
      <div class="row"><button class="btn pf-go">▶ Soltar</button><button class="btn pf-rst">↺ Reiniciar</button></div>
      <svg class="fig" viewBox="0 0 420 200">
        <line x1="210" y1="10" x2="210" y2="10" stroke="#22314a" stroke-width="3"/>
        <line class="pf-l" x1="210" y1="10" x2="210" y2="160" stroke="#22314a" stroke-width="3"/>
        <circle class="pf-b0" cx="210" cy="160" r="14" fill="#2f6fb0" fill-opacity=".6" stroke="#22314a" stroke-width="2"/>
        <text x="20" y="30" class="t" fill="#3c8d5a">E cinética</text><rect class="pf-k" x="130" y="16" width="0" height="18" fill="#3c8d5a"/>
        <text x="20" y="66" class="t" fill="#2f6fb0">E potencial</text><rect class="pf-p" x="130" y="52" width="0" height="18" fill="#2f6fb0"/>
        <text x="20" y="102" class="t" fill="#c8432b">Térmica</text><rect class="pf-q" x="130" y="88" width="0" height="18" fill="#c8432b"/>
        <text x="20" y="150" class="t">Total = cte (conservación)</text>
      </svg>
      <p class="note pf-t"></p>`;
    const q = s => el.querySelector(s);
    let th = 0, w = 0, Q = 0, E0 = 1, running = false, raf = null;
    function reset() {
      running = false; cancelAnimationFrame(raf);
      const a0 = +q('.pf-a').value * Math.PI / 180;
      th = a0; w = 0; Q = 0;
      E0 = G * (1 - Math.cos(a0));
      q('.pf-go').textContent = '▶ Soltar';
      pintar();
    }
    function paso(dt, b) {
      const acc = -G * Math.sin(th) - b * w;   // θ'' = −(g/L) sin θ − b θ'
      const dissip = b * w * w;                 // potencia disipada
      w += acc * dt; th += w * dt; Q += dissip * dt;
    }
    function pintar() {
      const Ek = 0.5 * w * w, Ep = G * (1 - Math.cos(th));
      const fk = Ek / E0, fp = Ep / E0, fq = Q / E0;
      q('.pf-k').setAttribute('width', (260 * fk).toFixed(1));
      q('.pf-p').setAttribute('width', (260 * fp).toFixed(1));
      q('.pf-q').setAttribute('width', (260 * fq).toFixed(1));
      const x = 210 + 150 * Math.sin(th), y = 10 + 150 * Math.cos(th);
      q('.pf-l').setAttribute('x2', x.toFixed(1)); q('.pf-l').setAttribute('y2', y.toFixed(1));
      q('.pf-b0').setAttribute('cx', x.toFixed(1)); q('.pf-b0').setAttribute('cy', y.toFixed(1));
      const suma = ((Ek + Ep + Q) / E0 * 100).toFixed(1);
      q('.pf-t').innerHTML =
        `Suma E<sub>k</sub> + E<sub>p</sub> + Q = <span class="gr">${suma} %</span> de la energía inicial: se conserva. ` +
        `La fricción no la destruye, la convierte en calor. Con más fricción el péndulo se detiene antes.`;
    }
    function loop() {
      const b = +q('.pf-b').value;
      for (let k = 0; k < 4; k++) paso(0.005, b);
      pintar();
      if (Math.abs(w) < 0.002 && Math.abs(th) < 0.002) { running = false; q('.pf-go').textContent = '▶ Soltar'; return; }
      if (running) raf = requestAnimationFrame(loop);
    }
    q('.pf-a').addEventListener('input', () => { q('.pf-av').textContent = q('.pf-a').value + '°'; reset(); });
    q('.pf-b').addEventListener('input', () => { q('.pf-bv').textContent = q('.pf-b').value; });
    q('.pf-go').addEventListener('click', () => {
      if (running) { running = false; cancelAnimationFrame(raf); q('.pf-go').textContent = '▶ Seguir'; return; }
      running = true; q('.pf-go').textContent = '❚❚ Pausa'; raf = requestAnimationFrame(loop);
    });
    q('.pf-rst').addEventListener('click', reset);
    reset();
  },

  // 2) Calor entre dos cuerpos: la entropía total siempre aumenta
  //    ΔS = C ln(Tf/Th) + C ln(Tf/Tc) > 0 (dos cuerpos con igual capacidad C)
  entropia(el) {
    el.innerHTML = `
      <div class="row"><span class="note">Cuerpo caliente:</span>
        <input type="range" min="340" max="400" value="380" class="en-h"><b class="note en-hv">380 K</b></div>
      <div class="row"><span class="note">Cuerpo frío:</span>
        <input type="range" min="250" max="300" value="270" class="en-c"><b class="note en-cv">270 K</b></div>
      <div class="row"><button class="btn en-go">▶ Poner en contacto</button><button class="btn en-rst">↺ Reiniciar</button></div>
      <svg class="fig" viewBox="0 0 420 180">
        <rect class="en-bh" x="40" y="40" width="130" height="100" rx="12" fill="#c8432b" fill-opacity=".5" stroke="#22314a" stroke-width="2"/>
        <rect class="en-bc" x="250" y="40" width="130" height="100" rx="12" fill="#2f6fb0" fill-opacity=".5" stroke="#22314a" stroke-width="2"/>
        <text class="t en-th" x="70" y="100">380 K</text>
        <text class="t en-tc" x="280" y="100">270 K</text>
        <text class="t" x="180" y="165">contacto</text>
      </svg>
      <p class="note en-t"></p>`;
    const q = s => el.querySelector(s);
    let timer = null;
    function ds(Th, Tc, Tf) { return Math.log(Tf / Th) + Math.log(Tf / Tc); }
    function mostrar(Th, Tc) {
      q('.en-th').textContent = Math.round(Th) + ' K';
      q('.en-tc').textContent = Math.round(Tc) + ' K';
      const Tf = (Th + Tc) / 2;
      const S = ds(Th, Tc, Tf);
      q('.en-t').innerHTML = Math.abs(Th - Tc) < 0.5
        ? 'Ya están a la misma temperatura: ΔS = 0, no hay flujo de calor.'
        : `Entropía total: ΔS = C·ln(T<sub>f</sub>/T<sub>c</sub>) + C·ln(T<sub>f</sub>/T<sub>h</sub>) = ` +
          `<span class="gr">+${S.toFixed(3)} C</span>. El calor fluye de caliente a frío y ΔS &gt; 0. ` +
          `El proceso inverso daría ΔS &lt; 0 y no ocurre por sí solo (Clausius).`;
    }
    function reset() {
      clearInterval(timer); timer = null;
      const Th = +q('.en-h').value, Tc = +q('.en-c').value;
      q('.en-go').textContent = '▶ Poner en contacto';
      mostrar(Th, Tc);
    }
    q('.en-h').addEventListener('input', () => { q('.en-hv').textContent = q('.en-h').value + ' K'; reset(); });
    q('.en-c').addEventListener('input', () => { q('.en-cv').textContent = q('.en-c').value + ' K'; reset(); });
    q('.en-go').addEventListener('click', () => {
      if (timer) return;
      const Th0 = +q('.en-h').value, Tc0 = +q('.en-c').value, Tf = (Th0 + Tc0) / 2;
      let t = 0; q('.en-go').textContent = '…';
      timer = setInterval(() => {
        t += 0.04;
        const f = Math.min(t / 2.5, 1), e = 1 - Math.pow(1 - f, 2);   // suavizado
        const Th = Th0 + (Tf - Th0) * e, Tc = Tc0 + (Tf - Tc0) * e;
        mostrar(Th, Tc);
        if (f >= 1) { clearInterval(timer); timer = null; q('.en-go').textContent = '✓ Equilibrio'; }
      }, 40);
    });
    q('.en-rst').addEventListener('click', reset);
    reset();
  }
});