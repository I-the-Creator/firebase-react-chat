import React, { useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

import Img from '../images/img.png'
import Attach from '../images/attach.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const MessageInput = () => {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const handleSend = async () => {
    if (image) {
      // to store image file uploaded in messageInput to Firebase storage with name = userDisplayName
      const storageRef = ref(storage, `image-${uuid()}`)

      const uploadTask = uploadBytesResumable(storageRef, image)

      uploadTask.on(
        'state_changed',

        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Image upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Image upload is paused')
              break
            case 'running':
              // console.log('Upload is running')
              break
            default:
          }
        },

        (error) => {
          // setError(true)
        },

        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            })
          })
        }
      )
    } else {
      // just add text message without image
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      })
    }

    // add 'lastMessage' data to user's 'userChats' record for user who the message was sent to
    // and update 'date' property with current time
    await updateDoc(doc(db, 'userChats', data.selectedUser.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    })

    // add 'lastMessage' data to user's 'userChats' record for current user
    // and update 'date' property with current time
    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    })

    // cleanup input area and image file
    setText('')
    setImage(null)
  }

  return (
    <div className="messageInput">
      <input
        type="text"
        placeholder="Type your message..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: 'none' }}
          id="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default MessageInput
