import React, { useEffect, useState } from 'react'
import logo from '../icons/logo.svg'
import '../styles/Header.css'
import HeaderBtn from './UI/HeaderButton/HeaderBtn'
import '../styles/App.css'
import {validate, logOut, userInfo} from './ApiReqests/ApiRequests'
import { useNavigate } from 'react-router-dom'




const Header = function(){
    const [validation, setValidation] = useState(false)
    const [userInformation, setUserInfo] = useState()
    const [validTried, setValidTried] = useState(false)
    useEffect(() => {
        const valid = async () => {
            let res = await validate(localStorage.getItem('TOKEN'))
            setValidation(res)
            setValidTried(true)
        } 
        const getUserInfo = async () => {
            let res = await userInfo(localStorage.getItem('TOKEN'))
            setUserInfo(res)
            }
        valid()
        getUserInfo()
        .catch()
    }, [])
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
        navigate('/signin')
        logOut()
    }
    function handleAdminClick(){
        navigate('/admin')
    }
    function handleEditorClick(){
        navigate('/editor')
    }
    if (validTried && userInformation) {
        if (userInformation.role === 'ROLE_ADMIN'){
            return (
                <div className='header '>
                    <div className='headerContent'>
                        <img src={logo}  alt="logo" onClick={handleHomeClick} style={{cursor: 'pointer'}}/>
                        <div className='headerBtns'>
                            <HeaderBtn value='Главная' onClick={handleHomeClick}/>
                            <HeaderBtn value='Редактор' onClick={handleEditorClick}/>
                            <HeaderBtn value='Профиль' onClick={handleProfileClick}/>
                            <HeaderBtn value='Админка' onClick={handleAdminClick}/>
                            <HeaderBtn value='Выход' onClick={handleLogOutClick}/>
                        </div>
                    </div>
                </div>
            )}
        else {
            return (
                <div className='header '>
                    <div className='headerContent'>
                        <img src={logo}  alt="logo" onClick={handleHomeClick} style={{cursor: 'pointer'}}/>
                        <div className='headerBtns'>
                            <HeaderBtn value='Главная' onClick={handleHomeClick}/>
                            <HeaderBtn value='Редактор' onClick={handleEditorClick}/>
                            <HeaderBtn value='Профиль' onClick={handleProfileClick}/>
                            <HeaderBtn value='Выход' onClick={handleLogOutClick}/>
                        </div>
                    </div>
                </div>
            )
        }
        
    }
    else if (validTried && !userInformation){
        return (
            <div className='header '>
                <div className='headerContent'>
                    <img src={logo}  alt="logo" onClick={handleHomeClick} style={{cursor: 'pointer'}}/>
                    <div className='headerBtns'>
                        <HeaderBtn value='Главная' onClick={handleHomeClick}/>
                        <HeaderBtn value='Вход' onClick={handleSignInClick}/>
                    </div>
                </div>
            </div>
        )
    } else{console.log(validation)}
}

export default Header