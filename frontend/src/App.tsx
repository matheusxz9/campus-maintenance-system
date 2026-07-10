import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Listagem from './pages/Listagem'
import Abertura from './pages/Abertura'
import Detalhes from './pages/Detalhes'

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
            {tema === 'claro' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
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