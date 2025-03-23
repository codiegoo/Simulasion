'use client'
import Link from 'next/link';
import './main.sass';
import { useEffect } from 'react';
// Componente principal
export default function Home() {
  // Usa useEffect para mostrar la alerta cuando el componente se monta
  useEffect(() => {
    const portada = `
      Universidad Autónoma de Occidente
      Nombre: Flores Alcantar Diego Edvaldo
      Matrícula: 23020026
      Fecha: 24 / 03 / 2025
    `;
    window.alert(portada);
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  return (
    <div className='inicioContain'>
      <h1>Ejercicios de chi2 Simulación <br /> utilizando JavaScript 🤩</h1>
      <nav>
        <Link href="/chocolates">
          Chocolates 🍫
        </Link>
        <Link href="/elecciones">
          Elecciones 🗳️
        </Link>
        <Link href="/menu">
          Menú 🍽️
        </Link>
      </nav>
    </div>
  );
}