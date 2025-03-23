'use client';
import { useState } from 'react';
import { calcularChi2, tomarDecision } from '@/utils/chi2.util';
import Link from 'next/link';
import '@/app/main.sass';

export default function Menu() {
  // Estados para los datos observados, esperados y hipótesis
  const [observados, setObservados] = useState([0, 0, 0, 0, 0]); // Valores iniciales
  const [esperados, setEsperados] = useState([0, 0, 0, 0, 0]); // Valores iniciales
  const [valorCritico, setValorCritico] = useState(0); // Valor crítico capturado por el usuario
  const [hipotesis, setHipotesis] = useState(['', '', '']); // Mínimo 3 hipótesis
  const [resultadoCorrecto, setResultadoCorrecto] = useState(null); // Resultado de la hipótesis correcta
  const [mostrarResultados, setMostrarResultados] = useState(false); // Estado para controlar la visibilidad de los resultados

  // Función para calcular los resultados
  const calcularResultados = () => {
    const resultadosCalculados = hipotesis.map((hip, index) => {
      const { chi2 } = calcularChi2(observados, esperados);
      const decision = tomarDecision(chi2, valorCritico);
      return { hipotesis: hip, chi2, decision };
    });

    // Identificar la hipótesis correcta (aquella que no rechaza H₀)
    const hipotesisCorrecta = resultadosCalculados.find(
      (resultado) => resultado.decision === "No rechazar H₀"
    );

    setResultadoCorrecto(hipotesisCorrecta || null); // Guardar la hipótesis correcta
    setMostrarResultados(true); // Mostrar resultados después de calcular
  };

  // Función para cerrar los resultados
  const cerrarResultados = () => {
    setMostrarResultados(false); // Ocultar resultados
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

  // Función para actualizar las hipótesis
  const handleHipotesisChange = (index, value) => {
    const nuevasHipotesis = [...hipotesis];
    nuevasHipotesis[index] = value;
    setHipotesis(nuevasHipotesis);
  };

  return (
    <div className='menuContain'>
      <Link className='homeBtn' href="/">
        Inicio🏠 
      </Link>
      <h2>Simulación de la prueba de chi-cuadrado</h2>

      <div className='datosContain'>
        <div style={{ marginBottom: '20px' }}>
          <h3>Ingresar datos observados:</h3>
          {observados.map((obs, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <label>Observado {i + 1}: </label>
              <input
                type="number"
                value={obs}
                onChange={(e) => handleObservadosChange(i, e.target.value)}
                style={{ width: '100px', marginLeft: '10px' }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Ingresar datos esperados:</h3>
          {esperados.map((esp, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <label>Esperado {i + 1}: </label>
              <input
                type="number"
                value={esp}
                onChange={(e) => handleEsperadosChange(i, e.target.value)}
                style={{ width: '100px', marginLeft: '10px' }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3>Ingresar valor crítico:</h3>
          <input
            type="number"
            value={valorCritico}
            onChange={(e) => setValorCritico(Number(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Ingresar hipótesis (mínimo 2):</h3>
        {hipotesis.map((hip, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <label>Hipótesis {i + 1}: </label>
            <input
              type="text"
              value={hip}
              onChange={(e) => handleHipotesisChange(i, e.target.value)}
              style={{ width: '300px', marginLeft: '10px' }}
            />
          </div>
        ))}
      </div>

      <button onClick={calcularResultados} style={{ marginBottom: '20px', padding: '10px' }}>
        Calcular
      </button>

      {mostrarResultados && resultadoCorrecto && (
        <div className='resultadosContain'>
          <div className='resultadosInner'>
            <h3>Resultado de la hipótesis correcta:</h3>
            <p>
              <strong>Hipótesis:</strong> {resultadoCorrecto.hipotesis}
            </p>
            <p>
              <strong>Estadístico chi-cuadrado (χ²):</strong> {resultadoCorrecto.chi2.toFixed(2)}
            </p>
            <p>
              <strong>Decisión:</strong> {resultadoCorrecto.decision}
            </p>
            <hr />
            <button className='closeBtn' onClick={cerrarResultados} style={{ marginTop: '10px', padding: '10px' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}