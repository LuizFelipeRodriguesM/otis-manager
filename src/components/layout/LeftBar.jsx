import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BarChart3, Building2, Calculator, Users, LogOut } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'

const LeftBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeItem, setActiveItem] = useState('dashboard')
  const { logout } = useAuth()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/dashboard'
    },
    {
      id: 'installations',
      label: 'Instalações',
      icon: Building2,
      path: '/installations'
    },
    {
      id: 'interactions',
      label: 'Interações',
      icon: Users,
      path: '/interactions'
    },
    {
      id: 'budget',
      label: 'Simulação',
      icon: Calculator,
      path: '/budget'
    }
  ]

  useEffect(() => {
    // Atualizar o item ativo baseado na rota atual
    const currentPath = location.pathname
    const activeMenuItem = menuItems.find(item => item.path === currentPath)
    if (activeMenuItem) {
      setActiveItem(activeMenuItem.id)
    }
  }, [location.pathname])

  const handleNavigation = (path, id) => {
    setActiveItem(id)
    navigate(path)
  }

  const handleLogout = () => {
    // Faz logout através do contexto (limpa o cache)
    logout()
    // Redireciona para a página de login e recarrega a página
    navigate('/login')
    // Força o reload da página para garantir que tudo seja limpo
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <aside className="leftbar">
      <div className="leftbar-header">
        <h1 className="leftbar-title justify-center items-center">
          OTIS
        </h1>
        <div className="leftbar-theme-toggle">
          <ThemeToggle />
        </div>
      </div>

      {/* Navegação principal */}
      <nav className="leftbar-nav">
        <ul className="leftbar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="leftbar-menu-item">
              <button
                className={`leftbar-menu-link ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path, item.id)}
              >
                <span className="leftbar-menu-icon">
                  <item.icon size={20} />
                </span>
                <span className="leftbar-menu-text">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Botão de Logout no bottom */}
      <div className="leftbar-logout-bottom">
        <button
          className="leftbar-menu-link logout-btn"
          onClick={handleLogout}
        >
          <span className="leftbar-menu-icon">
            <LogOut size={20} />
          </span>
          <span className="leftbar-menu-text">Sair</span>
        </button>
      </div>
    </aside>
  )
}

export default LeftBar
