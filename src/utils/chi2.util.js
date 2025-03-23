// utils/chi2.js

// Función para calcular el estadístico chi-cuadrado
export function calcularChi2(observados, esperados) {
  let chi2 = 0;
  const terminos = observados.map((obs, i) => {
    const esp = esperados[i];
    const termino = Math.pow(obs - esp, 2) / esp;
    chi2 += termino;
    return { obs, esp, termino };
  });
  return { chi2, terminos };
};

export function calcularValorCritico(dof, alpha) {
  // Valores críticos precalculados para chi-cuadrado
  const valoresCriticos = {
    1: { 0.05: 3.841, 0.01: 6.635, 0.001: 10.828 },
    2: { 0.05: 5.991, 0.01: 9.210, 0.001: 13.816 },
    3: { 0.05: 7.815, 0.01: 11.345, 0.001: 16.266 },
    4: { 0.05: 9.488, 0.01: 13.277, 0.001: 18.467 },
    5: { 0.05: 11.070, 0.01: 15.086, 0.001: 20.515 },
    6: { 0.05: 12.592, 0.01: 16.812, 0.001: 22.458 },
    7: { 0.05: 14.067, 0.01: 18.475, 0.001: 24.322 },
    8: { 0.05: 15.507, 0.01: 20.090, 0.001: 26.125 },
    9: { 0.05: 16.919, 0.01: 21.666, 0.001: 27.877 },
    10: { 0.05: 18.307, 0.01: 23.209, 0.001: 29.588 },
    11: { 0.05: 19.675, 0.01: 24.725, 0.001: 31.264 },
    12: { 0.05: 21.026, 0.01: 26.217, 0.001: 32.910 },
    13: { 0.05: 22.362, 0.01: 27.688, 0.001: 34.528 },
    14: { 0.05: 23.685, 0.01: 29.141, 0.001: 36.123 },
    15: { 0.05: 24.996, 0.01: 30.578, 0.001: 37.697 },
    16: { 0.05: 26.296, 0.01: 32.000, 0.001: 39.252 },
    17: { 0.05: 27.587, 0.01: 33.409, 0.001: 40.790 },
    18: { 0.05: 28.869, 0.01: 34.805, 0.001: 42.312 },
    19: { 0.05: 30.144, 0.01: 36.191, 0.001: 43.820 },
    20: { 0.05: 31.410, 0.01: 37.566, 0.001: 45.315 },
    21: { 0.05: 32.671, 0.01: 38.932, 0.001: 46.797 },
    22: { 0.05: 33.924, 0.01: 40.289, 0.001: 48.268 },
    23: { 0.05: 35.172, 0.01: 41.638, 0.001: 49.728 },
    24: { 0.05: 36.415, 0.01: 42.980, 0.001: 51.179 },
    25: { 0.05: 37.652, 0.01: 44.314, 0.001: 52.620 },
    26: { 0.05: 38.885, 0.01: 45.642, 0.001: 54.052 },
    27: { 0.05: 40.113, 0.01: 46.963, 0.001: 55.476 },
    28: { 0.05: 41.337, 0.01: 48.278, 0.001: 56.892 },
    29: { 0.05: 42.557, 0.01: 49.588, 0.001: 58.301 },
    30: { 0.05: 43.773, 0.01: 50.892, 0.001: 59.703 },
    // Puedes agregar más grados de libertad si es necesario
  };

  // Verificar si el grado de libertad (dof) y el alpha están en la tabla
  if (valoresCriticos[dof] && valoresCriticos[dof][alpha]) {
    return valoresCriticos[dof][alpha];
  } else {
    throw new Error("Valores de dof o alpha no soportados");
  }
}

// Función para tomar la decisión basada en el estadístico chi-cuadrado y el valor crítico
export function tomarDecision(chi2, valorCritico) {
  return chi2 > valorCritico ? "Rechazar H₀" : "No rechazar H₀";
};