import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LeftBar from './components/layout/LeftBar'
import Dashboard from './pages/Dashboard'
import Installations from './pages/Installations'
import InstallationsDetails from './pages/InstallationsDetails'
import BudgetSimulation from './pages/BudgetSimulation'
import InteractionsAdmin from './pages/InteractionsAdmin'

const App = () => {
  return (
    <Router>
      <div className="app">
        <LeftBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/installations" element={<Installations />} />
            <Route path="/installations/:id" element={<InstallationsDetails />} />
            <Route path="/budget" element={<BudgetSimulation />} />
            <Route path="/interactions" element={<InteractionsAdmin />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
