import React, { useState} from 'react'
import FormBtn from '../Components/UI/FormButton/FormBtn.jsx'
import SignIn from '../Components/UI/LoginInput/SignIn.jsx'
import showPass from '../icons/showPass.svg'
import hidePass from '../icons/hidePass.svg'
import '../styles/LoginForm.css'
import '../styles/App.css'
import { getUser } from '../Components/ApiReqests/ApiRequests.jsx'
import { useNavigate } from 'react-router-dom'




const LoginForm = function(props){
    const [_email, setEmail] = useState('')
    const [_password, setPassword] = useState('')
    const [inputType, setInputType] = useState('password')
    const [iconType, setIconType] = useState(showPass)
    const [formInput, setFormInput] = useState('formInput')
    const [forgotPass, setForgotPass] = useState(`Забыли пароль?`)
    const [passClass, setPassClass] = useState(`notLox`)
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
    function ForgotPass() {
        setForgotPass(`Обратитес к администрации!`);
        setPassClass(`frogottenLox`);
    }
    function handleSignInError(){
        setFormInput('formInput formInputError')
    }
    const navigate = useNavigate()
    async function signin(email, password){
        if (await getUser(email, password)){
            navigate('/')
            window.location.reload()
        }
        else {
            handleSignInError()
        }
    }
    return (
        <div className="formContainer">
            <form className="login">
                <h2 className="formTitle">Вход</h2>
                <SignIn className={formInput} placeholder='Адрес электронной почты' value={_email} onChange={e => setEmail(e.target.value)} />
                <label className="huita">
                    <SignIn className={formInput} type={inputType} placeholder='Пароль' value={_password} onChange={e => setPassword(e.target.value)}/>         
                    <img className="inputIcon" onClick={passChange}  src={iconType} alt='passIcon' />
                </label>
                <div className="formInfo">
                    <label>
                        <input className="formCheckbox"  type='checkbox'/>
                        Согласен на обработку персональных данных
                    </label>
                    <p className={passClass} onClick={ForgotPass}>{forgotPass}</p>
                </div>
                <FormBtn onClick={async () => await signin(_email, _password)}/>
            </form>
        </div>
    )
}

export default LoginForm