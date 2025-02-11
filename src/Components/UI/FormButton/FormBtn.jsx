import React from 'react'
import styles from './FormBtn.module.css'

const FormBtn = function(props){
    return (
        <button {...props} className={styles.FormBtn} type="button" >
            {props.value}
        </button>
    )
}

export default FormBtn