import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  // get the currentUSer from global context
  const { currentUser } = useContext(AuthContext)

  // Firebase controls authentication process so we don't need to store current user in LS or cookies etc.
  // console.log('currentUser', currentUser) // DEBUG

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/chat_app/login" />
    }
    return children
  }

  return (
    <BrowserRouter>
      <Routes basename={process.env.PUBLIC_URL}>
        <Route path="chat_app/*">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
