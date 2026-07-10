import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Listagem from './pages/Listagem'
import Abertura from './pages/Abertura'
import Detalhes from './pages/Detalhes'

function IconeLua() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function IconeSol() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function App() {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tema') || 'claro'
  })

  useEffect(() => {
    const html = document.documentElement
    if (tema === 'escuro') {
      html.setAttribute('data-theme', 'dark')
    } else {
      html.removeAttribute('data-theme')
    }
    localStorage.setItem('tema', tema)
  }, [tema])

  function alternarTema() {
    setTema(t => t === 'claro' ? 'escuro' : 'claro')
  }

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          <h1>Sistema de Chamados - Campus</h1>
        </Link>
        <nav>
          <button className="btn btn-outline theme-toggle" onClick={alternarTema} title="Alternar tema">
            {tema === 'claro' ? <IconeLua /> : <IconeSol />}
          </button>
          <Link to="/" className="btn btn-outline">Listagem</Link>
          <Link to="/abrir" className="btn btn-primary">Abrir Chamado</Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Listagem />} />
          <Route path="/abrir" element={<Abertura />} />
          <Route path="/chamados/:id" element={<Detalhes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App