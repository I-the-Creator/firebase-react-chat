import React, { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'

import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Chats = () => {
  const [chats, setChats] = useState([])

  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  // request to DB to get all user chats for current(logged in) user
  // firebase onSnapshot method used to get real-time data
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
      setChats(doc.data())
    })

    //cleanup
    return () => {
      unsub()
    }
  }, [currentUser.uid])

  // console.log(Object.entries(chats))  // DEBUG

  const handleSelect = (selectedUser) => {
    dispatch({ type: 'CHANGE_USER', payload: selectedUser })
  }

  return (
    <div className="chats">
      {/* convert returned object - 'chats' -  to an Array of 'chat' objects 
      and sort it to show the chats in chronological order*/}
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].recipientInfo)} // send selected user object as a parameter
          >
            <img src={chat[1].recipientInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].recipientInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Chats
