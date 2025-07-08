import React from 'react'
import admin from '../../../icons/dark/admin.svg'
import editor from '../../../icons/dark/editor.svg'
import profile from '../../../icons/dark/profile.svg'
import logout from '../../../icons/dark/logout.svg'
import adminL from '../../../icons/light/adminL.svg'
import editorL from '../../../icons/light/editorL.svg'
import profileL from '../../../icons/light/profileL.svg'
import logoutL from '../../../icons/light/logoutL.svg'


const HeaderBtn = function(props){
    const logos = {
        editor: editor,
        admin: admin,
        profile: profile,
        logout: logout,
        adminL: adminL,
        editorL: editorL,
        profileL: profileL,
        logoutL: logoutL
    }
    return (
        <button className='cursor-pointer relative h-[55px] w-[55px] hover:scale-90 active:scale-80 transition duration-75 ease' {...props}>
            <img className='absolute h-full w-full top-0 bottom-0 fill-tLight dark:fill-tLightD' src={logos[props.value]} alt="B"></img>
        </button>
    )
}

export default HeaderBtn