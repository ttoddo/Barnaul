import React from 'react'
import styles from './AdminInput.module.css'



const AdminInput =function(props) {
  return (
    <input {...props} className={styles.adminInput}/> 
  )
}

export default AdminInput