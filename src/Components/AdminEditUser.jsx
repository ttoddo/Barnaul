import React, { useState } from 'react'
import AdminInput from './UI/AdminInput/AdminInput'
import CommonBtn from './UI/CommonButton/CommonBtn'
import '../styles/Admin.css'

const AdminEditUser =function(props) {
    const [id, setId] = useState(``)
    const [name, setName] = useState(``)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  return (
    <div className='adminEditUser'>
        <AdminInput placeholder='id' value={id} onChange={e => setId(e.target.value)}/>
        <AdminInput placeholder='Имя' value={name} onChange={e => setName(e.target.value)}/>
        <AdminInput placeholder='Почта' value={email} onChange={e => setEmail(e.target.value)}/>
        <AdminInput placeholder='Пароль' value={password} onChange={e => setPassword(e.target.value)}/>
        <CommonBtn style={{fontSize: 18, backgroundColor: `#A7CDE0`}}  value='Изменить данные пользователя'/>
    </div>
  )
}

export default AdminEditUser