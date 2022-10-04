import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Message = ({ message }) => {
  // console.log(message) // DEBUG

  // handle time
  var dateObj = message.date.toDate()
  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const ref = useRef()

  // to scroll to the bottom chat window once new message sent
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && 'owner'}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.selectedUser.photoURL
          }
          alt=""
        />
        <span className="time">{`${hours}:${minutes}`}</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message
