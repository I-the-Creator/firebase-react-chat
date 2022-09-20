import React from 'react'

const Chats = () => {
  return (
    <div className="chats">
      <div className="userChat">
        <img
          src="https://images.pexels.com/photos/13586038/pexels-photo-13586038.jpeg?auto=compress&cs=tinysrgb&w=300&lazy=load"
          alt=""
        />
        <div className="userChatInfo">
          <span>Jane</span>
          <p>My latest message</p>
        </div>
      </div>

      <div className="userChat">
        <img
          src="https://images.pexels.com/photos/13586038/pexels-photo-13586038.jpeg?auto=compress&cs=tinysrgb&w=300&lazy=load"
          alt=""
        />
        <div className="userChatInfo">
          <span>Jane</span>
          <p>My latest message</p>
        </div>
      </div>

      <div className="userChat">
        <img
          src="https://images.pexels.com/photos/13586038/pexels-photo-13586038.jpeg?auto=compress&cs=tinysrgb&w=300&lazy=load"
          alt=""
        />
        <div className="userChatInfo">
          <span>Jane</span>
          <p>My latest message</p>
        </div>
      </div>
    </div>
  )
}

export default Chats
