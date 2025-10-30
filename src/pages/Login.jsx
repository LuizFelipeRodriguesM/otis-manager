import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = (e) => {
    e.preventDefault()

    // Login sem verificação - aceita qualquer email e senha
    if (email.trim() && password.trim()) {
      // Faz login através do contexto
      login(email)

      // Redireciona para o dashboard
      navigate('/dashboard')
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
