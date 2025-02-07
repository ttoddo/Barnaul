import React from 'react'
import styles from './CommonBtn.module.css'

const CommonBtn =function(props) {
  return (
    <button className={styles.commonBtn} type='Button' {...props}>
        {props.value}
    </button>
  )
}

export default CommonBtn