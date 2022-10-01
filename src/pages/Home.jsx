import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'

import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const Home = () => {
  // get the currentUSer from global context
  const { currentUser } = useContext(AuthContext)

  return (
    <>
      {currentUser.displayName && (
        <div className="home">
          <div className="container">
            <Sidebar />
            <Chat />
          </div>
        </div>
      )}
    </>
  )
}

export default Home
