'use client';
import '@/app/main.sass'
import { useState } from 'react';
import { calcularChi2, calcularValorCritico, tomarDecision } from '@/utils/chi2.util';
import Link from 'next/link';

export default function Chi2Elecciones() {
  // Valores iniciales proporcionados por el ejercicio
  const valoresInicialesObservados = [82115, 27636, 32327, 5200, 6424, 10828];
  const valoresInicialesEsperados = valoresInicialesObservados.map((obs, i) => {
    if (i === 0) return obs * 1.05; // Morena aumenta 5%
    if (i === 1) return obs * 1.40; // PRI aumenta 40%
    if (i === 2) return obs * 1.25; // PAN aumenta 25%
    return obs; // PT, Verde y MC se mantienen
  });

  // Estados para los datos observados y esperados
  const [observados, setObservados] = useState(valoresInicialesObservados);
  const [esperados, setEsperados] = useState(valoresInicialesEsperados);

  // Estado para almacenar los resultados
  const [resultados, setResultados] = useState(null);

  // Parámetros del test
  const dof = observados.length - 1; // Grados de libertad
  const alpha = 0.05; // Nivel de significancia

  // Función para calcular los resultados
  const calcularResultados = () => {
    const valorCritico = calcularValorCritico(dof, alpha);
    const { chi2, terminos } = calcularChi2(observados, esperados);
    const decision = tomarDecision(chi2, valorCritico);
    setResultados({ chi2, terminos, valorCritico, decision, dof });
  };

  // Función para actualizar los datos observados
  const handleObservadosChange = (index, value) => {
    const nuevosObservados = [...observados];
    nuevosObservados[index] = Number(value);
    setObservados(nuevosObservados);
  };

  // Función para actualizar los datos esperados
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
            <div>
              <h3>Resultados:</h3>
              <p>
                <strong>Grados de libertad:</strong> {resultados.dof}
              </p>
              <p>
                <strong>Estadístico chi-cuadrado (χ²):</strong> {resultados.chi2.toFixed(2)}
              </p>
              <p>
                <strong>Valor crítico:</strong> {resultados.valorCritico.toFixed(2)}
              </p>
              <p>
                <strong>Decisión:</strong> {resultados.decision}
              </p>
            </div>
          )}
        </div>
      </div>

      <button onClick={calcularResultados} style={{ marginBottom: '20px', padding: '10px' }}>
        Calcular
      </button>
    </div>
  );
}