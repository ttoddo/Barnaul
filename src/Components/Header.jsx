import React, { useEffect, useState } from 'react'
import logo from '../icons/logo.svg'
import '../styles/Header.css'
import HeaderBtn from './UI/HeaderButton/HeaderBtn'
import '../styles/App.css'
import {validate, logOut} from './ApiReqests/ApiRequests'
import { useNavigate } from 'react-router-dom'




const Header = function(){
    const [validation, setValidation] = useState(false)
    useEffect(() => {
        async function valid() {
            var res = await validate(localStorage.getItem('TOKEN'))
        setValidation(res)
        }
        valid()
    })
    const navigate = useNavigate()
    function handleProfileClick() {
        navigate('/profile')
    }
    function handleHomeClick() {
        navigate('/')
    }
    function handleSignInClick(){
        navigate('/signin')
    }
    function handleLogOutClick(){
        logOut()
        navigate('/signin')
    }
    if (validation) {
        return (
            <div className='header '>
                <div className='headerContent'>
                    <a href='http://localhost:3000'>
                        <img src={logo}  alt="logo"/>
                    </a>
                    <div className='headerBtns'>
                        <HeaderBtn value='Главная' onClick={handleHomeClick}/>
                        <HeaderBtn value='Профиль' onClick={handleProfileClick}/>
                        <HeaderBtn value='Выход' onClick={handleLogOutClick}/>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='header '>
            <div className='headerContent'>
                <a href='http://localhost:3000'>
                    <img src={logo}  alt="logo"/>
                </a>
                <div className='headerBtns'>
                    <HeaderBtn value='Главная' onClick={handleHomeClick}/>
                    <HeaderBtn value='Вход' onClick={handleSignInClick}/>
                </div>
            </div>
        </div>
    )
}

export default Header