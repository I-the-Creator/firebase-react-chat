import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'

import { auth, storage, db } from '../firebase'
import Add from '../images/addAvatar.png'

import '../style.scss'

const Register = () => {
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userDisplayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const file = e.target[3].files[0]

    try {
      // response with user data stored in Firebase auth storage
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      // to store 'avatar' file uploaded on Registration to Firebase storage with name = userDisplayName
      const storageRef = ref(storage, userDisplayName)

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',

        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              // console.log('Upload is running')
              break
            default:
          }
        },

        (error) => {
          setError(true)
        },

        async () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              console.log('File available at:', downloadURL) // DEBUG

              await updateProfile(response.user, {
                // set the 'authentication DB' user object key:value which to be updated
                // to use this data in with AuthContext - e.g. currentUser info for Navbar component
                displayName: userDisplayName,
                photoURL: downloadURL,
              })

              // save to "users" Firestore DB collection data about displayName, email and photoURL
              // third parameter - record name in "users" collection
              await setDoc(doc(db, 'users', response.user.uid), {
                uid: response.user.uid,
                displayName: userDisplayName,
                email,
                photoURL: downloadURL,
              })

              // crete empty 'userChats' collection after Registration is complete
              await setDoc(doc(db, 'userChats', response.user.uid), {})
              navigate('/chat_app/') // on successful registration navigate to Home page
            }
          )
        }
      )
    } catch (error) {
      setError(true)
    }
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Truedjentleman Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input className="formFileInput" type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>

          <button>Sign Up</button>
          {error && (
            <>
              <span>Something went wrong!</span>
            </>
          )}
        </form>
        <p>
          Do you have an account?{' '}
          <Link to={`${process.env.REACT_APP_LOCAL_PATH}/login`}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
