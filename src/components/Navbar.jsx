import React from 'react'

const Navbar = () => {
  return (
    <div>
      <div className="navbar">
        <span className="logo">Truedjentleman Chat</span>
        <div className="user">
          <img
            src="https://images.pexels.com/photos/13586038/pexels-photo-13586038.jpeg?auto=compress&cs=tinysrgb&w=300&lazy=load"
            alt=""
          />
          <span>John</span>
          <button>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
