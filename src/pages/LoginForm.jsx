import React, { useState} from 'react'
import FormBtn from '../Components/UI/FormButton/FormBtn.jsx'
import SignIn from '../Components/UI/LoginInput/SignIn.jsx'
import showPass from '../icons/showPass.svg'
import hidePass from '../icons/hidePass.svg'
import '../styles/Form.css'
import '../styles/App.css'
import { getUser } from '../Components/ApiReqests/ApiRequests.jsx'



const LoginForm = function(props){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [inputType, setInputType] = useState('password')
    const [iconType, setIconType] = useState(showPass)


function passChange(){
    // eslint-disable-next-line no-cond-assign
    if(iconType === showPass ){
        setInputType('text');
        setIconType(hidePass)
    } else {
        setInputType('password');
        setIconType(showPass)
    }
}

    return (
        <form className='login'>
            <h2 className='formTitle'>Вход</h2>
            <SignIn placeholder='Адрес электронной почты' value={email} onChange={e => setEmail(e.target.value)} />
            <label className='huita'>
                <SignIn type={inputType} placeholder='Пароль' value={password} onChange={e => setPassword(e.target.value)}/>         
                <img className='inputIcon' onClick={passChange}  src={iconType} alt='passIcon' />
            </label>
            <div className='formInfo'>
                <label>
                    <input className='formCheckbox'  type='checkbox'/>
                    Согласен на обработку персональных данных
                </label>
                <a href='a'>Забыли пароль?</a>

            </div>
            <FormBtn onClick={async () => await getUser(email, password)}/>
        </form>
    )
}

export default LoginForm