import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LeftBar from './components/layout/LeftBar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Installations from './pages/Installations'
import InstallationsDetails from './pages/InstallationsDetails'
import BudgetSimulation from './pages/BudgetSimulation'
import InteractionsAdmin from './pages/InteractionsAdmin'

// Componente para verificar rotas inválidas em produção
const RouteGuard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    // Verifica se estamos em produção (não em desenvolvimento)
    const isProduction = import.meta.env.PROD

    if (isProduction) {
      // Rotas válidas da aplicação
      const validRoutes = ['/', '/dashboard', '/installations', '/budget', '/interactions', '/login']
      const isValidRoute = validRoutes.includes(location.pathname) ||
        location.pathname.startsWith('/installations/') // Para rotas dinâmicas como /installations/:id

      // Se a rota não é válida e não estamos logados, redireciona para login
      if (!isValidRoute && !isLoggedIn) {
        navigate('/login', { replace: true })
      }
    }
  }, [location.pathname, isLoggedIn, navigate])

  return null
}

const AppContent = () => {
  const { isLoggedIn } = useAuth()

  return (
    <>
      <RouteGuard />
      {isLoggedIn ? (
        <div className="app">
          <LeftBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/installations" element={<ProtectedRoute><Installations /></ProtectedRoute>} />
              <Route path="/installations/:id" element={<ProtectedRoute><InstallationsDetails /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><BudgetSimulation /></ProtectedRoute>} />
              <Route path="/interactions" element={<ProtectedRoute><InteractionsAdmin /></ProtectedRoute>} />
              {/* Redireciona login para dashboard se já estiver logado */}
              <Route path="/login" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
