import React from 'react'
import FormBtn from '../UI/FormBtn'
// import showPass from '../Icons/showPass.svg'
// import hidePass from '../Icons/hidePass.svg'
import '../styles/Form.css'
import '../styles/App.css'

// function passChange(){
//     // eslint-disable-next-line no-cond-assign
//     if(this.src = {hidePass} ){
//         document.querySelector(`#pass`).type = `text`;
//     } else {
//         document.querySelector(`#pass`).type = `password`;
//     }
// }

const LoginForm = function(){
    return (
        <form className='login'>
            <h2 className='formTitle'>Вход</h2>
            <input className='formInput' type='text' placeholder='Адрес электронной почты' />
            <input className='formInput' id='pass' type='password' placeholder='Пароль'/>         
            {/* <img className='inputIcon' onClick={passChange}  src={showPass} alt='passIcon' /> */}
            <div className='formInfo'>
                <label>
                    <input className='formCheckbox'  type='checkbox'/>
                    Согласен на обработку персональных данных
                </label>
                <a href='a'>Забыли пароль?</a>

            </div>
            <FormBtn/>
        </form>
    )
}

export default LoginForm