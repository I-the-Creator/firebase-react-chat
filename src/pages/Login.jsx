import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '../firebase'

import '../style.scss'

const Login = () => {
  const [error, setError] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value

    try {
      await signInWithEmailAndPassword(auth, email, password)

      // if everything is ok, redirect to home page
      navigate('/chat_app/')
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Truedjentleman Chat</span>
        <span className="title">Log in</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign Up</button>
          {error && (
            <>
              <span>Something went wrong!</span>
              <p>{error}</p>
            </>
          )}
        </form>
        <p>
          Don't have an account?{' '}
          <Link to={`${process.env.REACT_APP_LOCAL_PATH}/register`}>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
