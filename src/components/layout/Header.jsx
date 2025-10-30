import ThemeToggle from '../ui/ThemeToggle'

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">OTIS Manager</h1>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header

