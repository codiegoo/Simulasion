'use client';
import '@/app/main.sass'
import { useState } from 'react';
import { calcularChi2, calcularValorCritico } from '@/utils/chi2.util';
import Link from 'next/link';

export default function Chi2Elecciones() {
  // Valores iniciales
  const valoresInicialesObservados = [82115, 27636, 32327, 5200, 6424, 10828];
  const valoresInicialesEsperados = valoresInicialesObservados.map((obs, i) => {
    if (i === 0) return obs * 1.05; // Morena aumenta 5%
    if (i === 1) return obs * 1.40; // PRI aumenta 40%
    if (i === 2) return obs * 1.25; // PAN aumenta 25%
    return obs; // PT, Verde y MC se mantienen
  });

  const [observados, setObservados] = useState(valoresInicialesObservados);
  const [esperados, setEsperados] = useState(valoresInicialesEsperados);
  const [resultados, setResultados] = useState(null);

  const dof = observados.length - 1;
  const alpha = 0.05;

  const evaluarHipotesis = (chi2, valorCritico) => {
    const totalObservado = observados.reduce((a, b) => a + b, 0);
    const totalEsperado = esperados.reduce((a, b) => a + b, 0);
    const partidos = ['Morena', 'PRI', 'PAN', 'PT', 'Verde', 'MC'];
    
    // Hipótesis 1: Diferencias globales significativas
    const hipotesis1 = {
      nombre: "Diferencias significativas entre votos 2024 y proyección 2027",
      resultado: chi2 > valorCritico,
      explicacion: chi2 > valorCritico
        ? `Rechazamos la hipótesis nula (χ² = ${chi2.toFixed(2)} > ${valorCritico.toFixed(2)}). Existen diferencias estadísticamente significativas (p < 0.05) entre los resultados observados y la proyección para 2027.`
        : `No rechazamos la hipótesis nula (χ² = ${chi2.toFixed(2)} ≤ ${valorCritico.toFixed(2)}). Las diferencias entre observados y esperados pueden deberse a variaciones aleatorias.`
    };

    // Hipótesis 2: Crecimiento de partidos tradicionales
    const crecimientoTradicionales = (esperados[1] + esperados[2]) / (observados[1] + observados[2]);
    const hipotesis2 = {
      nombre: "Crecimiento conjunto significativo de partidos tradicionales (PRI + PAN)",
      resultado: crecimientoTradicionales > 1.3, // 30% de crecimiento combinado
      explicacion: crecimientoTradicionales > 1.3
        ? `Los partidos tradicionales (PRI + PAN) muestran un crecimiento conjunto significativo (${(crecimientoTradicionales*100-100).toFixed(1)}% > 30%). Esto sugiere una posible recuperación de estos partidos.`
        : `El crecimiento combinado de PRI y PAN (${(crecimientoTradicionales*100-100).toFixed(1)}% ≤ 30%) no es estadísticamente significativo según nuestro criterio.`
    };

    // Hipótesis 3: Mayor desviación en partido específico
    const desviaciones = observados.map((obs, i) => ({
      partido: partidos[i],
      valor: obs - esperados[i],
      porcentaje: Math.abs(obs - esperados[i]) / esperados[i] * 100
    }));
    
    const maxDesviacion = desviaciones.reduce((max, curr) => 
      Math.abs(curr.valor) > Math.abs(max.valor) ? curr : max);
    
    const hipotesis3 = {
      nombre: `Desviación más significativa en ${maxDesviacion.partido}`,
      resultado: Math.abs(maxDesviacion.porcentaje) > 15,
      explicacion: Math.abs(maxDesviacion.porcentaje) > 15
        ? `El partido ${maxDesviacion.partido} muestra la mayor desviación (${maxDesviacion.valor > 0 ? '+' : ''}${maxDesviacion.valor.toLocaleString()} votos, ${maxDesviacion.porcentaje.toFixed(1)}%). Esta diferencia sustancial podría indicar un cambio inesperado en su desempeño.`
        : `Ningún partido muestra desviaciones extremas (máxima: ${maxDesviacion.partido} con ${maxDesviacion.porcentaje.toFixed(1)}% ≤ 15%). Las variaciones están dentro de lo esperado.`
    };

    return [hipotesis1, hipotesis2, hipotesis3];
  };

  const calcularResultados = () => {
    const valorCritico = calcularValorCritico(dof, alpha);
    const { chi2, terminos } = calcularChi2(observados, esperados);
    const hipotesis = evaluarHipotesis(chi2, valorCritico);
    
    setResultados({ 
      chi2, 
      terminos, 
      valorCritico, 
      hipotesis,
      dof,
      decision: chi2 <= valorCritico 
        ? "No rechazar H₀ (los datos siguen la distribución esperada)" 
        : "Rechazar H₀ (los datos NO siguen la distribución esperada)"
    });
  };

  const handleObservadosChange = (index, value) => {
    const nuevosObservados = [...observados];
    nuevosObservados[index] = Number(value);
    setObservados(nuevosObservados);
  };

  const handleEsperadosChange = (index, value) => {
    const nuevosEsperados = [...esperados];
    nuevosEsperados[index] = Number(value);
    setEsperados(nuevosEsperados);
  };

  return (
    <div className="chocolatesContain">
      <Link href="/" className='homeBtn'>
        Inicio🏠 
      </Link>

      <div className="titleContain">
        <h2>Evaluar si hay una diferencia significativa entre los votos del 2024 y los esperados en 2027.</h2>
      </div>

      <div className='chocolatesInner'>
        <h3>Ingresar datos:</h3>
        <div className="datosContain">
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Partido</th>
                <th>Observados (2024)</th>
                <th>Esperados (2027)</th>
              </tr>
            </thead>
            <tbody>
              {observados.map((obs, i) => (
                <tr key={i}>
                  <td><strong>{['Morena', 'PRI', 'PAN', 'PT', 'Verde', 'MC'][i]}</strong></td>
                  <td>
                    <input
                      type="number"
                      value={obs}
                      onChange={(e) => handleObservadosChange(i, e.target.value)}
                      style={{ width: '100px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={esperados[i]}
                      onChange={(e) => handleEsperadosChange(i, e.target.value)}
                      style={{ width: '100px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {resultados && (
            <div className="resultadosContainer">
              <h3>Resultados del test χ²:</h3>
              <p>
                <strong>Grados de libertad:</strong> {resultados.dof}
              </p>
              <p>
                <strong>Estadístico chi-cuadrado (χ²):</strong> {resultados.chi2.toFixed(2)}
              </p>
              <p>
                <strong>Valor crítico (α=0.05):</strong> {resultados.valorCritico.toFixed(2)}
              </p>
              <p className={resultados.chi2 <= resultados.valorCritico ? "decision-no-rechazar" : "decision-rechazar"}>
                <strong>Decisión principal:</strong> {resultados.decision}
              </p>
              
              <h4>Análisis de hipótesis políticas:</h4>
              <ul className="hipotesis-list">
                {resultados.hipotesis.map((h, i) => (
                  <li key={i}>
                    <strong>{h.nombre}:</strong> {h.resultado ? "✅ Aceptada" : "❌ Rechazada"}
                    <div className="explicacion">{h.explicacion}</div>
                  </li>
                ))}
              </ul>
              
              <h4>Contribuciones individuales al χ²:</h4>
              <ul className="terminos-chi2">
                {resultados.terminos.map((t, i) => (
                  <li key={i}>
                    {['Morena', 'PRI', 'PAN', 'PT', 'Verde', 'MC'][i]}: {t.toFixed(2)}
                    {t === Math.max(...resultados.terminos) && " ← Mayor contribución"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <button onClick={calcularResultados} className="calcular-btn">
        Calcular
      </button>
    </div>
  );
}