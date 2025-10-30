import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  })
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || 'employee' // 'employee' ou 'client'
  })

  const login = (email, type = 'employee') => {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userType', type)
    setIsLoggedIn(true)
    setUserType(type)
  }

  const logout = () => {
    // Limpa completamente o localStorage (cache)
    localStorage.clear()
    setIsLoggedIn(false)
    setUserType('employee')
  }

  useEffect(() => {
    // Verifica mudanças no localStorage de outras abas
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn') {
        setIsLoggedIn(e.newValue === 'true')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const value = {
    isLoggedIn,
    userType,
    login,
    logout,
    userEmail: localStorage.getItem('userEmail')
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
