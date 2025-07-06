import { useEffect, useState } from 'react'
import logo from '../icons/logo.svg'
import HeaderBtn from './UI/HeaderButton/HeaderBtn'
import {logOut, userInfo} from './ApiReqests/ApiRequests'
import { useNavigate } from 'react-router-dom'

const Header = function(props){
    const linePoses = {
        logout: "absolute bottom-0 w-[65px] h-[5px] bg-tLightD right-[-5px] transition ease-in",
        admin: "absolute bottom-0 w-[65px] h-[5px] bg-tLightD right-[-5px] translate-x-[-90px] transition ease-in",
        profileAdmin: "absolute bottom-0 w-[65px] h-[5px] bg-tLightD right-[-5px] translate-x-[-180px] transition ease-in",
        editorAdmin: "absolute bottom-0 w-[65px] h-[5px] bg-tLightD right-[-5px] translate-x-[-270px] transition ease-in",
        profile: "absolute bottom-0 w-[65px] h-[5px] bg-tLightD right-[-5px] translate-x-[-90px] transition ease-in",
        editor: "absolute bottom-0 w-[65px] h-[5px] bg-tLightD right-[-5px] translate-x-[-180px] transition ease-in"
    }

    const themes = {
        light: "bg-bgDark min-w-screen h-18 flex items-center align-middle transition-colors ease-in-out duration-500",
        dark: "bg-bgDarkD min-w-screen h-18 flex items-center align-middle transition-colors ease-in-out duration-500"
    }


    const [userInformation, setUserInfo] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [currentLink, setCurrentLink] = useState()

    useEffect(() => {
        const getUserInfo = async () => {
            let res;
            try{
                res = await userInfo(localStorage.getItem('TOKEN'))
            } catch {
                let user = {role: null}
                setCurrentLink("logout")
                setUserInfo(user)
                setIsLoading(false)
            }
            if (res){
                setCurrentLink(res.role === 'ROLE_ADMIN' ? "editorAdmin" : "editor")
                setUserInfo(res)
                setIsLoading(false)
            } else {
                setCurrentLink("logout")
                let user = {role: null}
                setUserInfo(user)
                setIsLoading(false)
            }
            }
        getUserInfo()
    }, [])
    const navigate = useNavigate()
    function handleProfileClick() {
        setCurrentLink(userInformation.role === 'ROLE_ADMIN' ? "profileAdmin" : "profile")
        navigate('/profile')
    }
    function handleSignInClick(){
        navigate('/signin')
    }
    function handleLogOutClick(){
        setCurrentLink("logout")
        navigate('/signin')
        logOut()
    }
    function handleAdminClick(){
        setCurrentLink("admin")
        navigate('/admin')
    }
    function handleEditorClick(){
        setCurrentLink(userInformation.role === 'ROLE_ADMIN' ? "editorAdmin" : "editor")
        navigate('/editor')
    }
    if (isLoading){
        return (
            <div className='bg-bgDark dark:bg-bgDarkD min-w-screen h-18 flex items-center align-middle fixed top-0'>
                <div className='relative flex justify-between items-center ml-[25px] mr-[25px] h-full w-full'>
                    <div className='flex row h-full items-center gap-[20px] max-w-4/12 invisible lg:visible'>
                        <img src={logo} className='cursor-pointer' alt="logo" onClick={handleEditorClick}/>
                        <p className='text-tLight dark:text-tLightD font-bold text-[48px] transition ease-in-out duration-500'>BGITU.FIX</p>
                    </div>
                    {/* Тут должен быть скелетон кнопок. */}
                </div>
            </div>
        )
    } else if (!isLoading) {
        if (userInformation.role === 'ROLE_ADMIN'){
            return (
                <div className={`${themes[props.theme]}`}>
                    <div className='relative flex justify-between items-center ml-[25px] mr-[25px] h-full w-full'>
                        <div className='flex row h-full items-center gap-[20px] max-w-4/12 invisible lg:visible'>
                            <img src={logo} className='cursor-pointer' alt="logo" onClick={handleEditorClick}/>
                            <p className='text-tLight dark:text-tLightD font-bold text-[48px] transition ease-in-out duration-500'>BGITU.FIX</p>
                        </div>
                        <div className='flex gap-[35px]'>
                            <HeaderBtn value='editor' onClick={handleEditorClick}/>
                            <HeaderBtn value='profile' onClick={handleProfileClick}/>
                            <HeaderBtn value='admin' onClick={handleAdminClick}/>
                            <HeaderBtn value='logout' onClick={handleLogOutClick}/>
                        </div>
                        <div className={`${linePoses[currentLink]}`}></div>
                    </div>
                </div>
            )}
        else if (userInformation.role === 'ROLE_USER') {
            return (
                <div className='bg-bgDark dark:bg-bgDarkD min-w-screen h-18 flex items-center align-middle'>
                    <div className='relative flex justify-between items-center ml-[25px] mr-[25px] h-full w-full'>
                        <div className='flex row h-full items-center gap-[20px] max-w-4/12 invisible lg:visible'>
                            <img src={logo} className='cursor-pointer' alt="logo" onClick={handleEditorClick}/>
                            <p className='text-tLight dark:text-tLightD font-bold text-[48px] transition ease-in-out duration-500'>BGITU.FIX</p>
                        </div>
                        <div className='flex gap-[35px]'>
                            <HeaderBtn value='editor' onClick={handleEditorClick}/>
                            <HeaderBtn value='profile' onClick={handleProfileClick}/>
                            <HeaderBtn value='logout' onClick={handleLogOutClick}/>
                        </div>
                        <div className={`${linePoses[currentLink]}`}></div>
                    </div>
                </div>
            )
        } else {
        return (
            <div className='bg-bgDark dark:bg-bgDarkD min-w-screen h-18 flex items-center align-middle'>
                    <div className='relative flex justify-between items-center ml-[25px] mr-[25px] h-full w-full'>
                        <div className='flex row h-full items-center gap-[20px] max-w-4/12 invisible lg:visible'>
                            <img src={logo} className='cursor-pointer' alt="logo" onClick={handleEditorClick}/>
                            <p className='text-tLight dark:text-tLightD font-bold text-[48px] transition ease-in-out duration-500'>BGITU.FIX</p>
                        </div>
                    <div className='flex gap-[35px]'>
                        <HeaderBtn value='logout' onClick={handleSignInClick}/>
                    </div>
                    <div className={`${linePoses[currentLink]}`}></div>
                </div>
            </div>
        )}
    }
    
}

export default Header