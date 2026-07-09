import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Listagem from './pages/Listagem'
import Abertura from './pages/Abertura'
import Detalhes from './pages/Detalhes'

function App() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          <h1> Sistema de Chamados - Campus</h1>
        </Link>
        <nav>
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