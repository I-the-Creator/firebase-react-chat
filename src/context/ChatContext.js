import { useContext, useReducer } from 'react'
import { createContext } from 'react'

import { AuthContext } from './AuthContext'

export const ChatContext = createContext()

// 'children' prop represents apps components we feed with context
export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext)

  //using useReducer to combine data from 'chats' and 'users' collections
  // to get 'selected user' object and chats with that user
  // and to create combined STATE
  const INITIAL_STATE = {
    chatId: 'null',
    selectedUser: {},
  }

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          selectedUser: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        }
      default:
        return state
    }
  }

  //state - for data; dispatch - for dispatching actions,
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)
  // console.log(state) // DEBUG

  return (
    // wrap all app component in context Provider and specify data that components can reach
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}
