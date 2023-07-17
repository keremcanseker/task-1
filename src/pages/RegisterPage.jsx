
import React from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function RegisterPage() {
    const [mail, setMail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)

   async function register(ev){
     ev.preventDefault();
     const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({mail, username, password})
      })
      if (response.status === 200) {
        alert('registration successful');
        setRedirect(true);
        
      }
      else {
        alert('registration failed');
      }

   }
    if (redirect) {
      return <Navigate to={'/'} />
    }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="mail"
             placeholder="mail"
             value={mail}
             onChange={ev => setMail(ev.target.value)}/>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={e => setUsername(e.target.value)}
            />
      <input type="password"
             placeholder="password"
             value={password}
              onChange={e => setPassword(e.target.value)}
            />
      <button>Register</button>
    </form>
  )
}
