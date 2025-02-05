import React from "react";
import styles from './SignIn.module.css'

const SignIn = function(props){
    return (
        <input {...props} className={styles.formInput} />
    )
}

export default SignIn