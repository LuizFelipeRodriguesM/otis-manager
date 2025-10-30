import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  // Verifica se o usuário está logado através do localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  // Se não estiver logado, redireciona para a página de login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Se estiver logado, renderiza o componente filho
  return children
}

export default ProtectedRoute
