import React, { useState } from 'react'
import AdminInput from './UI/AdminInput/AdminInput'
import CommonBtn from './UI/CommonButton/CommonBtn'
import '../styles/Admin.css'
import styles from './UI/AdminInput/AdminInput.module.css'
import { editUser } from './ApiReqests/ApiRequests'

const AdminEditUser =function(props) {
    const [id, setId] = useState(``)
    const [name, setName] = useState(``)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [inputStyle, setInputStyle] = useState(styles.adminInput)


    async function handleEditUser(id, name, email, password, token) {
      if (password.length <= 8 || name.length === 0 || email.length === 0) {
        setInputStyle(styles.adminInputError)
      } else{
          await editUser(id, name, email, password, token)
          setInputStyle(styles.adminInput)
        }
      props.reset()
    }
    return (
      <div className='adminEditUser'>
          <AdminInput placeholder='id' value={id} onChange={e => setId(e.target.value)} className={inputStyle}/>
          <AdminInput placeholder='Имя' value={name} onChange={e => setName(e.target.value)} className={inputStyle}/>
          <AdminInput placeholder='Почта' value={email} onChange={e => setEmail(e.target.value)} className={inputStyle}/>
          <AdminInput placeholder='Пароль' value={password} onChange={e => setPassword(e.target.value)} className={inputStyle}/>
          <CommonBtn style={{fontSize: 16, backgroundColor: `#A7CDE0`}} onClick={async () => await handleEditUser(id, name, email, password, localStorage.getItem('TOKEN'))} value='Редактировать пользователя'/>
      </div>
    )
}

export default AdminEditUser