import Link from 'next/link';
import React from 'react';
import './main.sass'



// Componente principal
export default function Home() {
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