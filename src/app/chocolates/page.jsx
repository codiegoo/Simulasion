'use client';
import '@/app/main.sass';
import { useState } from 'react';
import { calcularChi2, calcularValorCritico } from '@/utils/chi2.util';
import Link from 'next/link';

export default function Chi2Bolsita() {
  const valoresInicialesObservados = [15, 25, 25, 10, 25];
  const valoresInicialesEsperados = [20, 20, 20, 20, 20];

  const [observados, setObservados] = useState(valoresInicialesObservados);
  const [esperados, setEsperados] = useState(valoresInicialesEsperados);
  const [resultados, setResultados] = useState(null);

  const dof = observados.length - 1;
  const alpha = 0.05;

  const evaluarHipotesis = (chi2, valorCritico) => {
    const totalObservado = observados.reduce((a, b) => a + b, 0);
    const totalEsperado = esperados.reduce((a, b) => a + b, 0);
    const esperadoPromedio = totalEsperado / esperados.length;
    
    // Hipótesis 1
    const decisionUniforme = chi2 <= valorCritico ? "no rechazar" : "rechazar";
    const explicacionUniforme = chi2 <= valorCritico
      ? `No rechazamos H₀ (χ² = ${chi2.toFixed(2)} ≤ ${valorCritico.toFixed(2)}) porque no hay evidencia suficiente de distribución no uniforme. Las diferencias pueden deberse a variaciones aleatorias.`
      : `Rechazamos H₀ (χ² = ${chi2.toFixed(2)} > ${valorCritico.toFixed(2)}) con p < 0.05. Hay evidencia significativa de que los colores no siguen una distribución uniforme.`;
  
    // Hipótesis 2
    const coloresCalidos = observados[0] + observados[3] + observados[4];
    const proporcionCalidos = (coloresCalidos / totalObservado) * 100;
    const decisionCalidos = proporcionCalidos > 60 ? "aceptar" : "no aceptar";
    const explicacionCalidos = proporcionCalidos > 60
      ? `Aceptamos la preferencia por colores cálidos (${proporcionCalidos.toFixed(1)}% > 60%). Los colores rojo, amarillo y naranja predominan significativamente.`
      : `No encontramos preferencia por colores cálidos (${proporcionCalidos.toFixed(1)}% ≤ 60%). La distribución entre cálidos y fríos parece equilibrada.`;
  
    // Hipótesis 3
    const desviaciones = observados.map((obs, i) => ({
      color: ['Rojo', 'Verde', 'Azul', 'Amarillo', 'Naranja'][i],
      valor: Math.abs(obs - esperados[i]),
      porcentaje: (Math.abs(obs - esperados[i]) / esperadoPromedio) * 100
    }));
    
    const maxDesviacion = desviaciones.reduce((max, curr) => 
      curr.valor > max.valor ? curr : max, desviaciones[0]);
    
    const decisionDesviacion = maxDesviacion.porcentaje > 20 ? "aceptar" : "no aceptar";
    const explicacionDesviacion = maxDesviacion.porcentaje > 20
      ? `Desviación significativa en ${maxDesviacion.color} (${maxDesviacion.porcentaje.toFixed(1)}% > 20%). Diferencia absoluta: ${maxDesviacion.valor}. Posible factor específico afectando este color.`
      : `Ningún color muestra desviación significativa (máxima: ${maxDesviacion.color} con ${maxDesviacion.porcentaje.toFixed(1)}% ≤ 20%). Todas las variaciones están dentro del rango esperado.`;
  
    return [
      {
        nombre: "Distribución uniforme de colores",
        resultado: decisionUniforme === "no rechazar",
        explicacion: explicacionUniforme
      },
      {
        nombre: "Preferencia por colores cálidos (rojo, amarillo, naranja)",
        resultado: decisionCalidos === "aceptar",
        explicacion: explicacionCalidos
      },
      {
        nombre: `Desviación significativa en color específico`,
        resultado: decisionDesviacion === "aceptar",
        explicacion: explicacionDesviacion
      }
    ];
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
    <div className='chocolatesContain'>
      <Link href="/" className='homeBtn'>
        Inicio🏠 
      </Link>
      <div className='titleContain'>
        <h2>Evaluar si la distribución de colores en una bolsa sigue la distribución esperada.</h2>
        <p>
          <strong>Ejemplo:</strong> Prueba de bondad de ajuste para colores en una bolsa.
        </p>
      </div>

      <div className='chocolatesInner'>
        <h3>Ingresar datos:</h3>
        <div className="datosContain">
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Color</th>
                <th>Observados</th>
                <th>Esperados</th>
              </tr>
            </thead>
            <tbody>
              {observados.map((obs, i) => (
                <tr key={i}>
                  <td><strong>{['Rojo', 'Verde', 'Azul', 'Amarillo', 'Naranja'][i]}</strong></td>
                  <td>
                    <input
                      type="number"
                      value={obs}
                      onChange={(e) => handleObservadosChange(i, e.target.value)}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={esperados[i]}
                      onChange={(e) => handleEsperadosChange(i, e.target.value)}
                      style={{ width: '60px' }}
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
              
              <h4>Evaluación de hipótesis adicionales:</h4>
              <ul className="hipotesis-list">
                {resultados.hipotesis.map((h, i) => (
                  <li key={i}>
                    <strong>{h.nombre}:</strong> {h.resultado ? "✅ Aceptada" : "❌ Rechazada"}
                    <div className="explicacion">{h.explicacion}</div>
                  </li>
                ))}
              </ul>
              
              <h4>Términos individuales χ²:</h4>
              <ul>
                {resultados.terminos.map((t, i) => (
                  <li key={i}>
                    {['Rojo', 'Verde', 'Azul', 'Amarillo', 'Naranja'][i]}: {t.toFixed(2)}
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