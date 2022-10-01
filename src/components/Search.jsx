import React, { useState } from 'react'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '../firebase'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Search = () => {
  const [usernameSearchQuery, setUsernameSearchQuery] = useState('')
  const [userFound, setUserFound] = useState(null)
  const [err, setErr] = useState(false)

  const { currentUser } = useContext(AuthContext)

  const usersRef = collection(db, 'users')

  const handleSearch = async () => {
    // search for "dispalyName" == search query in DB collection "users"
    const queryToDB = query(
      usersRef,
      where('displayName', '==', usernameSearchQuery)
    )
    try {
      const querySnapshot = await getDocs(queryToDB)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // set the state for found user
        setUserFound(doc.data())
      })
    } catch (error) {
      console.log(error)
      setErr(true)
    }
  }

  // console.log(userFound) // DEBUG

  // On Enter key press down - trigger the handleSearch function
  const handleEnterKeyDown = (e) => {
    e.code === 'Enter' && handleSearch()
  }

  // on user select in chats list
  const handleSelect = async () => {
    // check whether the group(chats record in firestore collection) exists for these two users
    //based on users combined IDs.

    const combinedID =
      currentUser.uid > userFound.uid
        ? currentUser.uid + userFound.uid
        : userFound.uid + currentUser.uid
    // get the data from DB
    try {
      const res = await getDoc(doc(db, 'chats', combinedID))

      //  if response doesn't exist in DB
      if (!res.exists()) {
        // create a chat records in 'chats' collection
        await setDoc(doc(db, 'chats', combinedID), { messages: [] })

        /* 
          currentUserChats : {
            user1_id : {
              combinedId: {
                userInfo {
                  displayName, img, id
                },
                lastMessage: "",
                date: message_date
              }
            }
          }
        */

        // create userChats for current(active) User
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedID + '.recipientInfo']: {
            uid: userFound.uid,
            displayName: userFound.displayName,
            photoURL: userFound.photoURL,
          },
          [combinedID + '.date']: serverTimestamp(),
        })

        // create userChats for selected User
        await updateDoc(doc(db, 'userChats', userFound.uid), {
          [combinedID + '.recipientInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + '.date']: serverTimestamp(),
        })
      }
    } catch (error) {
      console.log(error.message)
    }

    // close search results after selecting user and reset search query
    setUserFound(null)
    setUsernameSearchQuery('')
  }

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onChange={(e) => setUsernameSearchQuery(e.target.value)}
          onKeyDown={handleEnterKeyDown}
          value={usernameSearchQuery}
        />
      </div>
      {err && <span>User not found!</span>}
      {userFound && (
        <div className="userChat" onClick={handleSelect}>
          <img src={userFound.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{userFound.displayName}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search
