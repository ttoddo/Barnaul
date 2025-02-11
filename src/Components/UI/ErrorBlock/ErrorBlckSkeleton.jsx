import React from 'react'
import styles from './ErrorBlckSkeleton.module.css'



const ErrorBlockSkeleton =function(props) {
  return (
    <div className={styles.error}>
        <div className={styles.errorInfo}>
            <div className={styles.errorColor}></div>
            <div className={styles.errorText}>
                <p className={styles.errorTitle}></p>
                <label className={styles.errorSubInfo}>
                    <span></span>
                    <span></span>
                </label>
            </div>
        </div>
        <p className={styles.errorStatus}></p>
    </div>
  )
}

export default ErrorBlockSkeleton