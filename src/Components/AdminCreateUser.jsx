import React, {  useState } from 'react'
import AdminInput from './UI/AdminInput/AdminInput'
import CommonBtn from './UI/CommonButton/CommonBtn'
import '../styles/Admin.css'
import styles from './UI/AdminInput/AdminInput.module.css'
import { addUser } from './ApiReqests/ApiRequests'

const AdminCreateUser =function(props) {
    const [name, setName] = useState(``)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState(false)
    const [inputStyle, setInputStyle] = useState(styles.adminInput)
    const [color, setColor] = useState('transparent')
    async function handleAddUser(name, email, password, role, token) {
      let admin = ''
      if (role){
        admin = 'ROLE_ADMIN';
      } else admin = 'ROLE_USER';
      if (password.length <= 8 || name.length === 0 || email.length === 0) {
        setInputStyle(styles.adminInputError)
        setColor('red')
      } else{
          await addUser(name, email, password, admin, token)
          setInputStyle(styles.adminInput)
          setColor('transparent')
        }
      props.reset()
    }
  return (
    <div className='adminCreateUser'>
        <AdminInput placeholder='Имя' value={name} onChange={e => setName(e.target.value)} className={inputStyle}/>
        <AdminInput placeholder='Почта' value={email} onChange={e => setEmail(e.target.value)} className={inputStyle}/>
        <AdminInput placeholder='Пароль' value={password} onChange={e => setPassword(e.target.value)} className={inputStyle}/>
        <label className='adminCheckBoxText'>
            <input className='adminCheckBox'  type='checkbox' checked={role} onChange={e => setRole(e.target.checked)}/>
            Администратор <br/> <span style={{fontSize: 12, userSelect:"none", color:color}}>Минимальная длина пароля - 8 символов</span>
        </label>
        <CommonBtn style={{fontSize: 16, backgroundColor: `#A7CDE0`}} onClick={async () => await handleAddUser(name, email, password, role, localStorage.getItem('TOKEN'))} value='Добавить пользователя'/>
    </div>
  )
}

export default AdminCreateUser