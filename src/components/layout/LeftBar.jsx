import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BarChart3, Building2, MessageSquare } from 'lucide-react'

const LeftBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeItem, setActiveItem] = useState('dashboard')

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

  return (
    <aside className="leftbar">
      <div className="leftbar-header">
        <h1 className="leftbar-title justify-center items-center">
          OTIS
        </h1>
      </div>

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
    </aside>
  )
}

export default LeftBar
