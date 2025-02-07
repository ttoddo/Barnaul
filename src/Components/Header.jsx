import React, { useEffect, useState } from 'react'
import logo from '../icons/logo.svg'
import '../styles/Header.css'
import HeaderBtn from './UI/HeaderButton/HeaderBtn'
import '../styles/App.css'
import {validate, logOut} from './ApiReqests/ApiRequests'




const Header = function(){
    const [validation, setValidation] = useState(false)
    useEffect(() => {
        async function valid() {
            var res = await validate(localStorage.getItem('TOKEN'))
        setValidation(res)
        }
        valid()
    })
    console.log(validation)
    if (validation) {
        return (
            <div className='header '>
                <div className='headerContent container'>
                    <img src={logo}  alt="logo"/>
                    <div className='headerBtns'>
                        <HeaderBtn value='Главная'/>
                        <HeaderBtn value='Профиль'/>
                        <HeaderBtn value='Выход' onClick={logOut}/>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='header '>
            <div className='headerContent container'>
                <img src={logo}  alt="logo"/>
                <div className='headerBtns'>
                    <HeaderBtn value='Главная'/>
                    <HeaderBtn value='Вход'/>
                </div>
            </div>
        </div>
    )
}

export default Header