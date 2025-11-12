import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css' 

function Header() {
  return (
    <header className="main-header">
      <nav>
        <ul>
          <li>
            <Link to="/">Início</Link>
          </li>
          <li>
            <Link to="/crud">Tabela CRUD</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header