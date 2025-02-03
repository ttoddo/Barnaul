import React from 'react'
import logo from '../Icons/logo.svg'
import '../styles/Header.css'
import HeaderBtn from './Button'
import '../styles/App.css'

const Header = function(){
    return (
        <div className='header '>
            <div className='headerContent container'>
                <img src={logo}  alt="logo"/>
                <div className='headerBtns'>
                    <HeaderBtn/>
                    <HeaderBtn/>
                    <HeaderBtn/>
                </div>
            </div>
        </div>
    )
}

export default Header