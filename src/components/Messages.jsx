import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'

import { ChatContext } from '../context/ChatContext'
import { db } from '../firebase'
import Message from './Message'

const Messages = () => {
  const [messages, setMessages] = useState([])

  const { data } = useContext(ChatContext)

  //fetch 'chats' collection form DB to get messages for selected chat
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => {
      unsub()
    }
  }, [data.chatId])

  // console.log(messages) // DEBUG

  return (
    <div className="messages">
      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </div>
  )
}

export default Messages
