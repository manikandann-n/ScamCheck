import React from 'react'
import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className="pt-16 sm:pt-20">{children}</main>
    </div>
  )
}

export default Layout