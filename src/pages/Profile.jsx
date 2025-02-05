
import React from 'react'
import styles from '../Components/UI/FormButton/FormBtn.module.css'

const GetToken = () => {
    console.log(localStorage.getItem('TOKEN'))
}

const Profile = () => {
  return (
    <button type='button' className={styles.FormBtn} onClick={GetToken}>asdfasdf</button>
  )
}

export default Profile