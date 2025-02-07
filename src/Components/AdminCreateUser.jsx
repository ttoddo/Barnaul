import React, { useState } from 'react'
import AdminInput from './UI/AdminInput/AdminInput'
import CommonBtn from './UI/CommonButton/CommonBtn'
import '../styles/Admin.css'

const AdminCreateUser =function(props) {
    const [name, setName] = useState(``)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  return (
    <div className='adminCreateUser'>
        <AdminInput placeholder='Имя' value={name} onChange={e => setName(e.target.value)}/>
        <AdminInput placeholder='Почта' value={email} onChange={e => setEmail(e.target.value)}/>
        <AdminInput placeholder='Пароль' value={password} onChange={e => setPassword(e.target.value)}/>
        <label className='adminCheckBoxText'>
            <input className='adminCheckBox'  type='checkbox'/>
            Администратор
        </label>
        <CommonBtn style={{marginTop: 20, fontSize: 16, backgroundColor: `#A7CDE0`}}  value='Добавить пользователя'/>
    </div>
  )
}

export default AdminCreateUser