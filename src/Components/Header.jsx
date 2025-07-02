import { useEffect, useState } from 'react'
import logo from '../icons/logo.svg'
import '../styles/Header.css'
import HeaderBtn from './UI/HeaderButton/HeaderBtn'
import '../styles/App.css'
import {logOut, userInfo} from './ApiReqests/ApiRequests'
import { useNavigate } from 'react-router-dom'

const Header = function(){
    const [userInformation, setUserInfo] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getUserInfo = async () => {
            let res = await userInfo(localStorage.getItem('TOKEN'))
            if (res){
                setUserInfo(res)
                setIsLoading(false)
            }
            }
        getUserInfo()
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
    if (isLoading){
        return (
            <div className='header'>
                <div className='headerContent'>
                    <img src={logo} alt="logo" onClick={handleHomeClick} style={{cursor: 'pointer'}}/>
                    {/* Тут должен быть скелетон кнопок. */}
                </div>
            </div>
        )
    } else 
    if (userInformation.role === 'ROLE_ADMIN'){
        return (
            <div className='header'>
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
    else if (userInformation.role === 'ROLE_USER') {
        return (
            <div className='header'>
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
    } else
    return (
        <div className='header'>
            <div className='headerContent'>
                <img src={logo}  alt="logo" onClick={handleHomeClick} style={{cursor: 'pointer'}}/>
                <div className='headerBtns'>
                    <HeaderBtn value='Главная' onClick={handleHomeClick}/>
                    <HeaderBtn value='Вход' onClick={handleSignInClick}/>
                </div>
            </div>
        </div>
    )
}

export default Header