// Interactividad de la guía de análisis de funciones
"use strict";

const $ = (id) => document.getElementById(id);
const formatNumber = (value) => Number(value.toFixed(6)).toString();

function updateDomain() {
  const raw = $("dom-val").value.trim();
  $("dom-out").textContent = raw === "" || !Number.isFinite(Number(raw))
    ? "Escribe un número para encontrar el valor excluido."
    : `El denominador se hace cero cuando x = ${formatNumber(Number(raw))}. Ese valor se excluye del dominio.`;
}

function updateIntercepts() {
  const raw = $("int-val").value.trim();
  const output = $("int-out");
  if (raw === "" || !Number.isFinite(Number(raw))) {
    output.textContent = "Escribe un número para calcular los interceptos.";
    return;
  }
  const b = Number(raw);
  let result = `Eje Y: (0, ${formatNumber(-b)}). `;
  if (b > 0) {
    const root = Math.sqrt(b);
    result += `Eje X: (${formatNumber(-root)}, 0) y (${formatNumber(root)}, 0).`;
  } else if (b < 0) {
    result += "Eje X: no hay cortes reales.";
  } else {
    result += "Eje X: (0, 0). La gráfica pasa por el origen.";
  }
  output.textContent = result;
}

function updateDegreeRule() {
  const n = Number($("num-degree").value);
  const m = Number($("den-degree").value);
  const a = Number($("num-coeff").value);
  const b = Number($("den-coeff").value);
  const output = $("degree-result");

  if (![n, m, a, b].every(Number.isFinite) || n < 0 || m < 0 ||
      !Number.isInteger(n) || !Number.isInteger(m) || n > 12 || m > 12 ||
      b === 0 || $("num-coeff").value.trim() === "" || $("den-coeff").value.trim() === "") {
    output.textContent = "Revisa los grados (enteros entre 0 y 12) y los coeficientes principales. El de abajo no puede ser cero.";
    return;
  }

  if (n < m) {
    output.innerHTML = "<b>Grado de arriba menor.</b><br>Asíntota horizontal: <b>y = 0</b>.";
  } else if (n === m) {
    const quotient = a / b;
    output.innerHTML = `<b>Grados iguales.</b><br>Coeficientes principales: ${a} ÷ ${b} = <b>${formatNumber(quotient)}</b>.<br>Asíntota horizontal: <b>y = ${formatNumber(quotient)}</b>.`;
  } else if (n === m + 1) {
    output.innerHTML = "<b>El grado de arriba supera por 1 al de abajo.</b><br>No hay asíntota horizontal. Revisa la <b>oblicua</b> mediante división o límites.";
  } else {
    output.innerHTML = `<b>El grado de arriba supera por ${n - m} unidades.</b><br>No hay asíntota horizontal ni oblicua lineal. Haz la <b>división de polinomios</b> para revisar una posible asíntota polinómica.`;
  }
}

$("dom-val").addEventListener("input", updateDomain);
$("int-val").addEventListener("input", updateIntercepts);
["num-degree", "den-degree", "num-coeff", "den-coeff"].forEach((id) => {
  $(id).addEventListener("input", updateDegreeRule);
});
updateDomain();
updateIntercepts();
updateDegreeRule();

const checks = [...document.querySelectorAll(".step-check")];
function updateProgress() {
  const completed = checks.filter((check) => check.checked).length;
  $("progress-text").textContent = `${completed} de ${checks.length} pasos`;
  $("progress-bar").style.width = `${(completed / checks.length) * 100}%`;
  checks.forEach((check) => check.closest(".step-card").classList.toggle("completed", check.checked));
}
checks.forEach((check) => check.addEventListener("change", updateProgress));
$("reset-progress").addEventListener("click", () => {
  checks.forEach((check) => { check.checked = false; });
  updateProgress();
});
updateProgress();