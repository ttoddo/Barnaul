import React from 'react'
import styles from './UserInfo.module.css'
import CommonBtn from '../../UI/CommonButton/CommonBtn'



const UserInfo =function(props) {
  return (
    <div className={styles.user}>
        <div className={styles.userText}>
            <p className={styles.userName}>{props.user.title}</p>
            <label className={styles.errorSubInfo}>
               <span>{props.user.role}</span>
                <span>{props.user.id}</span>
            </label>
        </div>
        <CommonBtn value='Удалить'/>
    </div>
  )
}

export default UserInfo