import React from 'react'
import CommonBtn from './UI/CommonButton/CommonBtn'
import '../styles/Profile.css'
import {logOut} from './ApiReqests/ApiRequests'

const ProfileInfo =function(props) {
  return (
    <div className='profileInfo'>
        <p className='userName'>Жирнов Савва</p>
        <p className='userMail'>pochta@mail.ru</p>
        <CommonBtn style={{marginTop: 50,backgroundColor: `#A7CDE0`}} onClick={logOut} value='Выйти'/>
    </div>
  )
}

export default ProfileInfo