import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LeftBar from './components/layout/LeftBar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import Installations from './pages/Installations'

const App = () => {
  return (
    <Router>
      <div className="app">
        <LeftBar />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/installations" element={<Installations />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
