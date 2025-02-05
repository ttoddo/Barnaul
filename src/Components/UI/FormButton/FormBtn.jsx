import React from 'react'
import styles from './FormBtn.module.css'
import UserProfile from '../../UserProfile/UserProfile'

async function getUser (email, password){
    const api = "http://138.124.127.43:8081/"
    const settings = {
      method : 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {username: email,
        password: password}
      )
    }
    try {
      const res = await fetch(api + 'auth/sign-in', settings)
      const data = await res.json()
      console.log('success')
      localStorage.setItem('TOKEN', data.token)
      return data
    } catch {
      return console.log("error")
    }
}

const FormBtn = function(props){
    return (
        <button className={styles.FormBtn} type="button" onClick={async () => await getUser(props.email, props.password)}>
            Кнопочка
        </button>
    )
}

export default FormBtn