import React from 'react'
import './Button.css'
function Button({ children, onClick, variant = 'primary' }) {
  const className = `btn btn-${variant}`

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button