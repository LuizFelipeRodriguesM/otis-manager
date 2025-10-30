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

  const login = (email) => {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', email)
    setIsLoggedIn(true)
  }

  const logout = () => {
    // Limpa completamente o localStorage (cache)
    localStorage.clear()
    setIsLoggedIn(false)
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
