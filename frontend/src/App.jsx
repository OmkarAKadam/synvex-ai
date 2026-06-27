import { useState } from 'react'
import heroImg from './assets/hero.png'

function App() {
  

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <img src={heroImg} alt="Hero" className="w-full h-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
        <p className="text-gray-700 mb-4">
          This is a simple React application with Tailwind CSS styling.
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Get Started
        </button>
      </div>
    </div>
    </>
  )
}

export default App
