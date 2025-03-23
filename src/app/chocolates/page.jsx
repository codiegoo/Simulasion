// components/Chi2Bolsita.js
'use client';
import '@/app/main.sass';
import { useState } from 'react';
import { calcularChi2, calcularValorCritico, tomarDecision } from '@/utils/chi2.util';
import Link from 'next/link';

export default function Chi2Bolsita() {
  // Valores iniciales proporcionados por el ejercicio
  const valoresInicialesObservados = [15, 25, 25, 10, 25];
  const valoresInicialesEsperados = [20, 20, 20, 20, 20];

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