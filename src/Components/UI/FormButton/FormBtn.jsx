import React from 'react'
import styles from './FormBtn.module.css'

const FormBtn = function(props){
    return (
        <button {...props} className={styles.FormBtn} type="button" >
            Кнопочка
        </button>
    )
}

export default FormBtn