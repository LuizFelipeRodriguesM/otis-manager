import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('employee')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = (e) => {
    e.preventDefault()

    // Login sem verificação - aceita qualquer email e senha
    if (email.trim() && password.trim()) {
      // Faz login através do contexto
      login(email, userType)

      // Redireciona baseado no tipo de usuário
      if (userType === 'client') {
        navigate('/client-feedback')
      } else {
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <h1 className="login-title">OTIS Manager</h1>
          <p className="login-subtitle">Entre na sua conta</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input login-input"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input login-input"
                placeholder="Sua senha"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Tipo de Usuário
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  border: `2px solid ${userType === 'employee' ? '#2563eb' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  backgroundColor: userType === 'employee' ? '#eff6ff' : 'transparent',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="userType"
                    value="employee"
                    checked={userType === 'employee'}
                    onChange={(e) => setUserType(e.target.value)}
                    style={{ margin: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>Funcionário</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Acesso administrativo</div>
                  </div>
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  border: `2px solid ${userType === 'client' ? '#2563eb' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  backgroundColor: userType === 'client' ? '#eff6ff' : 'transparent',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="userType"
                    value="client"
                    checked={userType === 'client'}
                    onChange={(e) => setUserType(e.target.value)}
                    style={{ margin: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>Cliente</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Enviar feedback</div>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Entrar
            </button>
          </form>
        </div>
      </div>

      <div className="login-image-section">
        <div className="login-image-container">
          <img
            src="https://www.otis.com//documents/256045/367318156/Meta-Image-for-web-pages-small.png/c9eb2add-baf0-521c-10aa-977a282e94b6?t=1683528733730"
            alt="OTIS"
            className="login-image"
          />
        </div>
      </div>
    </div>
  )
}

export default Login
