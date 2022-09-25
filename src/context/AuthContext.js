import { useEffect } from 'react'
import { createContext, useState } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export const AuthContext = createContext()

// 'children' prop represents apps components we feed with context
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({})

  //check whether we authenticated  - have a valid user logged or not
  useEffect(() => {
    // firebase check for authenticated user and update state
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      //   console.log(user) // DEBUG
    })

    // clean up function to avoid memory leaking as we're listening real-time operation (work with remote DB)
    return () => {
      unsub()
    }
  }, [])

  return (
    // wrap all app component in context Provider and specify data that components can reach
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
