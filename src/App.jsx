import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

// Páginas
import HomePage from './pages/HomePage.jsx'
import CrudPage from './pages/CrudPage.jsx'

// Componentes
import Header from './components/Header/Header.jsx' 

function App() {
  return (
    <div>
      <Header />{/* Header */}
      <main>{/* Rotas */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/crud" element={<CrudPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App