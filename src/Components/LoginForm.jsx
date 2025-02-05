import React, { useState} from 'react'
import FormBtn from './UI/FormButton/FormBtn.jsx'
import SignIn from './UI/LoginInput/SignIn.jsx'
import showPass from '../icons/showPass.svg'
import hidePass from '../icons/hidePass.svg'
import '../styles/Form.css'
import '../styles/App.css'



const LoginForm = function(props){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [inputType, setInputType] = useState('password')
    const [iconType, setIconType] = useState(showPass)


function passChange(){
    // eslint-disable-next-line no-cond-assign
    if(iconType == showPass ){
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
            <FormBtn email={email} password={password}/>
        </form>
    )
}

export default LoginForm