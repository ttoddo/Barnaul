import React, { useEffect, useState } from 'react'
import CommonBtn from './UI/CommonButton/CommonBtn'
import '../styles/Profile.css'
import {logOut, userInfo} from './ApiReqests/ApiRequests'
import { useNavigate } from 'react-router-dom'

const ProfileInfo = function(props) {
  const [userInformation, setUserInfo] = useState()
  useEffect(() => {
      async function getUserInfo() {
          var res = await userInfo(localStorage.getItem('TOKEN'))
          setUserInfo(res)
          console.log(res)
          }
      getUserInfo()
  }, [])

  const navigate = useNavigate()
  function handleLogOutClick(){
    navigate('/signin')
    logOut()
  }
  if (userInformation){
    return (
      <div className='profileInfo'>
          <p className='userName'>{userInformation.username}</p>
          <p className='userMail'>{userInformation.email}</p>
          <CommonBtn style={{marginTop: 50,backgroundColor: `#A7CDE0`}} onClick={handleLogOutClick} value='Выйти'/>
      </div>
    )
  }
}

export default ProfileInfo