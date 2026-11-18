// js/interactivo.js
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg';
const mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};

/* ---------- navegación ---------- */
const scenes=$$('.scene');let cur=0,auto=false,timer=null;
function show(i){cur=(i+scenes.length)%scenes.length;scenes.forEach((s,k)=>s.classList.toggle('on',k===cur));
  $('#cnt').textContent=(cur+1)+' / '+scenes.length;$('#fill').style.width=((cur+1)/scenes.length*100)+'%';$('#auto').classList.toggle('sel',auto);}
function go(d){show(cur+d)}
$('#next').onclick=()=>go(1);$('#prev').onclick=()=>go(-1);
$('#auto').onclick=()=>{auto=!auto;clearInterval(timer);if(auto)timer=setInterval(()=>go(1),14000);show(cur)};
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' ')go(1);if(e.key==='ArrowLeft')go(-1);if(e.key==='f'||e.key==='F')toggleFull()});
function toggleFull(){if(!document.fullscreenElement){(document.documentElement.requestFullscreen||(()=>{})).call(document.documentElement)}else{document.exitFullscreen()}}
$('#full').onclick=toggleFull;
let tx=null;document.addEventListener('touchstart',e=>tx=e.touches[0].clientX);
document.addEventListener('touchend',e=>{if(tx===null)return;const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>60)go(d<0?1:-1);tx=null});

/* ---------- 2: radiación ---------- */
const RAYS=[{id:'a',y:90,amp:0,n:'α'},{id:'b',y:130,amp:5,n:'β'},{id:'g',y:170,amp:9,n:'γ'}];
const MAT={papel:{x:170,c:'#e8d9b0',s:['a']},aluminio:{x:235,c:'#b9c6d3',s:['a','b']},plomo:{x:300,c:'#6b6b78',s:['a','b','g']}};
RAYS.forEach(r=>{let d=`M90 ${r.y}`;for(let x=94;x<=400;x+=4)d+=` L${x} ${(r.y+r.amp*Math.sin(x/5)).toFixed(1)}`;$('#r-'+r.id).setAttribute('d',d)});
function setMat(k){const M=MAT[k],bar=$('#bar');bar.setAttribute('x',M.x-6);bar.setAttribute('fill',M.c);
  const bt=$('#bartxt');bt.setAttribute('x',M.x-22);bt.textContent=k;
  const pass=[],stop=[];
  RAYS.forEach(r=>{const hit=M.s.includes(r.id),p=$('#r-'+r.id);
    p.setAttribute('stroke-dasharray',(hit?(M.x-90)/310*100:100).toFixed(1)+' 100');
    (hit?stop:pass).push(r.n)});
  $('#res').innerHTML=`<span class="gr">Atraviesan: ${pass.length?pass.join(', '):'ninguna'}</span> · <span class="hl">Se detienen: ${stop.join(', ')}</span>`;
  $$('.mbtn').forEach(b=>b.classList.toggle('sel',b.dataset.m===k));}
$$('.mbtn').forEach(b=>b.onclick=()=>setMat(b.dataset.m));setMat('papel');

/* ---------- 3: fisión ---------- */
const fis=$('#fis'),X=[60,190,320,450];
const Y=g=>Array.from({length:2**g},(_,i)=>30+(i+.5)*(190/2**g));
for(let g=0;g<4;g++)Y(g).forEach(y=>fis.appendChild(mk('circle',{cx:X[g],cy:y,r:13,fill:'#2f6fb0','fill-opacity':.25,stroke:'#2f6fb0','stroke-width':3,class:'nd g'+g+(g===0?' v':'')})));
let fgen=0;
const FT=['Un neutrón parte un núcleo de U-235.','Cada núcleo partido libera 2 neutrones: ya son 2 núcleos nuevos.','Ahora hay 4 neutrones buscando núcleos: la cadena se multiplica.','8 núcleos partidos. Con masa crítica la cadena sigue creciendo de forma exponencial.'];
$('#fire').onclick=()=>{if(fgen>=3)return;const g=fgen;
  for(let i=0;i<2**g;i++)for(let k=0;k<2;k++){const j=2*i+k;
    const p=mk('path',{d:`M${X[g]+13} ${Y(g)[i]} L${X[g+1]-13} ${Y(g+1)[j]}`,class:'ln',pathLength:100,stroke:'#c8432b','stroke-width':3,'stroke-linecap':'round'});
    fis.appendChild(p);requestAnimationFrame(()=>requestAnimationFrame(()=>p.style.strokeDashoffset=0));}
  fis.querySelectorAll('.g'+(g+1)).forEach(c=>c.classList.add('v'));
  fgen++;$('#ftxt').textContent=FT[fgen];};
$('#fres').onclick=()=>{fis.querySelectorAll('.ln').forEach(e=>e.remove());fis.querySelectorAll('.nd').forEach(c=>c.classList.toggle('v',c.classList.contains('g0')));fgen=0;$('#ftxt').textContent=FT[0];};

/* ---------- 4: bomba vs reactor ---------- */
function upd4(){const r=+$('#rod').value,k=1.6-1.2*(r/100);
  $('#rodv').textContent=r+'%';
  $('#rod1').setAttribute('height',10+r/100*120);$('#rod2').setAttribute('height',10+r/100*120);
  for(let g=0;g<6;g++){const N=10*k**g,h=Math.min(N,120)/120*150;const b=$('#b'+g);b.setAttribute('y',180-h);b.setAttribute('height',Math.max(h,4));}
  const st=k<0.95?'<span class="gr">se apaga</span>':k<=1.05?'<span class="bl">estable (k ≈ 1)</span>':'<span class="hl">crece</span>';
  $('#kt').textContent='k = '+k.toFixed(2);
  $('#ktxt').innerHTML='Cada generación multiplica neutrones por k. Ahora la cadena '+st+'.';}
$('#rod').oninput=upd4;upd4();

/* ---------- 5: central ---------- */
let reactorOn=false;
$('#rOn').onclick=()=>{reactorOn=!reactorOn;
  $('#rOn').textContent=reactorOn?'Apagar reactor':'Encender reactor';
  $('#blades').classList.toggle('go',reactorOn);
  $('#vap').style.opacity=reactorOn?1:0;
  $('#bulb').setAttribute('fill',reactorOn?'#f2c94c':'none');
  $('#bulbg').setAttribute('opacity',reactorOn?1:0);};

/* ---------- 6: medicina ---------- */
const MED={
 diag:{svg:`<circle cx="200" cy="50" r="22" class="ink" pathLength="1000"/><path d="M200 75 L200 150 M200 100 L160 130 M200 100 L240 130 M200 150 L170 200 M200 150 L230 200" class="ink" pathLength="1000"/><circle cx="200" cy="105" r="10" fill="#c8432b" stroke="none"><animate attributeName="r" values="6;16;6" dur="1.6s" repeatCount="indefinite"/></circle><path d="M300 40 H380 V110 H300 Z" class="ink" pathLength="1000"/><text x="300" y="150" class="t">cámara</text><path d="M240 105 L300 80" stroke="#c8432b" stroke-dasharray="4 6" fill="none" stroke-width="2"/>`,
  t:'El paciente recibe un trazador radiactivo (Tc-99m) que emite rayos gamma detectados por una cámara especial.'},
 rad:{svg:`<circle cx="330" cy="110" r="32" class="ink" pathLength="1000"/><text x="312" y="115" class="t">tumor</text><path d="M30 40 L300 100 M30 110 L300 110 M30 180 L300 120 M30 75 L300 105" stroke="#c8432b" stroke-width="3" fill="none" class="ink" pathLength="1000"/><text x="40" y="208" class="t">haces desde varios ángulos</text>`,
  t:'Haces de radiación dirigidos desde múltiples ángulos destruyen el tejido tumoral concentrando la dosis.'},
 tir:{svg:`<path d="M140 60 Q 180 30 210 60 Q 240 30 280 60 Q 300 100 260 130 Q 230 150 210 120 Q 190 150 160 130 Q 120 100 140 60 Z" class="ink" pathLength="1000"/><text x="190" y="100" class="t">I-131</text><path d="M30 190 H390" stroke="#22314a" stroke-width="2" fill="none" stroke-dasharray="6 6"/><text x="20" y="215" class="t">cuello</text>`,
  t:'El yodo radiactivo I-131 es absorbido selectivamente por la tiroides para tratar células hiperactivas.'},
 est:{svg:`<rect x="150" y="60" width="120" height="90" rx="6" class="ink" pathLength="1000"/><path d="M40 80 Q 60 60 80 80 T 120 80 M40 110 Q 60 90 80 110 T 120 110 M40 140 Q 60 120 80 140 T 120 140" stroke="#2f6fb0" fill="none" stroke-width="2" class="ink" pathLength="1000"/><path d="M290 80 Q 310 60 330 80 T 370 80 M290 110 Q 310 90 330 110 T 370 110 M290 140 Q 310 120 330 140 T 370 140" stroke="#c8432b" fill="none" stroke-width="2" class="ink" pathLength="1000"/><text x="165" y="115" class="t">instrumental</text>`,
  t:'Esterilización de equipos médicos mediante radiación gamma eliminando gérmenes sin calor.'}};
function showMed(k){$$('#cards .card').forEach(c=>c.classList.toggle('sel',c.dataset.k===k));
  $('#medsvg').innerHTML=`<g filter="url(#rough)">${MED[k].svg}</g>`;
  $('#medtxt').textContent=MED[k].t;}
$$('#cards .card').forEach(c=>c.onclick=()=>showMed(c.dataset.k));showMed('diag');

/* ---------- 7: fórmulas ---------- */
function upd7(){const m=+$('#mass').value;$('#massv').textContent=m+' g';
  const E=m/1000*8.988e16,kt=E/4.184e12;
  $('#eout').innerHTML=`E = ${E.toExponential(2)} J &nbsp;≈ ${kt.toFixed(1)} kilotones de TNT`;}
function upd7b(){const u=+$('#util').value;$('#utilv').textContent=u+' J';
  $('#effbar').style.width=u/60*100+'%';$('#eff').textContent=u+' %';}
$('#mass').oninput=upd7;$('#util').oninput=upd7b;upd7();upd7b();

/* ---------- 8: repaso ---------- */
$$('.item').forEach(b=>b.onclick=()=>{b.classList.toggle('on');
  const n=$$('.item.on').length;
  $('#done').textContent=n===5?'¡Excelente! Todo comprendido para el parcial.':'Pregúntate: ¿qué controla la cadena?';});

/* ---------- 9: quiz ---------- */
const Q = [
  { p: '¿Qué radiación se detiene con una hoja de papel?', o: ['α (alfa)', 'β (beta)', 'γ (gamma)'], c: 0, r: 'La alfa es un núcleo de helio pesado, fácilmente frenada por papel.' },
  { p: 'En la fisión de un U-235, ¿cuántos neutrones nuevos salen?', o: ['1', '2 o 3', '10'], c: 1, r: 'Liberan 2 o 3 neutrones capaces de mantener la reacción en cadena.' },
  { p: '¿Qué diferencia al reactor de la bomba si la física es la misma?', o: ['El combustible', 'Las barras de control', 'La temperatura'], c: 1, r: 'Las barras de control absorben el exceso de neutrones manteniendo k ≈ 1.' },
  { p: 'En la fórmula E = mc², ¿qué representa m?', o: ['La masa que se convierte en energía', 'La masa total del reactor', 'La masa del agua'], c: 0, r: 'La masa defectiva que se transforma íntegramente en energía pura.' }
];
const box = document.getElementById('quiz');
box.innerHTML = Q.map((q, i) => `
  <div class="qbox" data-i="${i}" style="margin-bottom:12px;">
    <p class="note"><b>${i + 1}.</b> ${q.p}</p>
    <div class="row">${q.o.map((o, j) => `<button class="btn qb" data-j="${j}">${o}</button>`).join('')}</div>
    <p class="note qr"></p>
  </div>`).join('');
box.querySelectorAll('.qbox').forEach(card => {
  const q = Q[+card.dataset.i];
  card.querySelectorAll('.qb').forEach(b => b.addEventListener('click', () => {
    const ok = +b.dataset.j === q.c;
    b.style.background = ok ? 'var(--green)' : 'var(--red)';
    b.style.color = '#fff';
    card.querySelector('.qr').innerHTML = (ok ? '<span class="gr">✓ Correcto.</span> ' : '<span class="hl">✗ No.</span> ') + q.r;
  }));
});

show(0);

/* ==========================================================
   MODO ANIMACIÓN AUTOMÁTICA EXPLICATIVA (ESTILO VIDEO ANIMADO)
   ========================================================== */
const PASOS_ANIMACION = [
  { escena: 0, texto: "🎬 ¡Hola profe! Comencemos viendo cómo la materia y sus núcleos inestables generan radiación." },
  { escena: 1, texto: "📡 Paso 1: Dependiendo del tipo de radiación (Alfa, Beta o Gamma), necesitamos diferentes barreras físicas." },
  { escena: 2, texto: "⚛️ Paso 2: La fisión nuclear. Al impactar un neutrón, el núcleo se parte y multiplica los neutrones exponencialmente." },
  { escena: 3, texto: "🎛️ Paso 3: Reactor vs Bomba. Si movemos las barras de control absorbemos neutrones y estabilizamos la energía." },
  { escena: 4, texto: "⚡ Paso 4: El reactor funciona como una máquina de vapor que mueve turbinas para generar electricidad limpia." },
  { escena: 5, texto: "🏥 Paso 5: En medicina aplicamos isótopos con dosis controladas para diagnósticos precisos y radioterapia." },
  { escena: 6, texto: "📐 Paso 6: La ecuación de Einstein E = mc² nos muestra la tremenda energía liberada al perder masa." },
  { escena: 7, texto: "📝 Paso 7: ¡Repaso completado con éxito y listos para las preguntas del parcial en vivo!" },
  { escena: 8, texto: "🎯 ¡Resolvamos las preguntas oficiales juntos frente al auditorio!" }
];

let animacionActiva = false;
let animTimer = null;
const bubble = document.getElementById('anim-bubble');
const btnAnimar = document.getElementById('btnAnimar');

function ejecutarPasoAnimacion() {
  if (!animacionActiva) return;
  const paso = PASOS_ANIMACION[cur];
  if (bubble && paso) {
    bubble.style.display = 'block';
    bubble.innerHTML = paso.texto;
    
    if (cur === 2) {
      const fireBtn = $('#fire');
      if (fireBtn) fireBtn.click();
    } else if (cur === 4) {
      const rOnBtn = $('#rOn');
      if (rOnBtn && !rOnBtn.textContent.includes('Apagar')) rOnBtn.click();
    }
  }
}

btnAnimar.onclick = () => {
  animacionActiva = !animacionActiva;
  if (animacionActiva) {
    btnAnimar.textContent = "⏹ Detener Animación";
    btnAnimar.style.background = "var(--green)";
    show(0);
    ejecutarPasoAnimacion();
    
    clearInterval(animTimer);
    animTimer = setInterval(() => {
      if (cur < scenes.length - 1) {
        go(1);
        ejecutarPasoAnimacion();
      } else {
        detenerAnimacion();
      }
    }, 10000);
  } else {
    detenerAnimacion();
  }
};

function detenerAnimacion() {
  animacionActiva = false;
  clearInterval(animTimer);
  btnAnimar.textContent = "▶ Reproducir Animación Explicativa";
  btnAnimar.style.background = "var(--red)";
  if (bubble) bubble.style.display = 'none';
}

$('#next').addEventListener('click', () => { if (animacionActiva) setTimeout(ejecutarPasoAnimacion, 100); });
$('#prev').addEventListener('click', () => { if (animacionActiva) setTimeout(ejecutarPasoAnimacion, 100); });