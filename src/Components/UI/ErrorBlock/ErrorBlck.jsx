import React from 'react'
import styles from './ErrorBlck.module.css'



const ErrorBlock =function(props) {
  return (
    <div className={styles.error}>
        <div className={styles.errorInfo}>
            <div className={styles.errorColor} style={{backgroundColor: props.error.color}}></div>
            <div className={styles.errorText}>
                <p className={styles.errorTitle}>{props.error.title}</p>
                <label className={styles.errorSubInfo}>
                    <span>{props.error.date}</span>
                    <span>{props.error.username}</span>
                </label>
            </div>
        </div>
        <p className={styles.errorStatus}>{props.error.status}</p>
    </div>
  )
}

export default ErrorBlock