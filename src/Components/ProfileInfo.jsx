import React, { useEffect, useState } from 'react'
import CommonBtn from './UI/CommonButton/CommonBtn'
import {logOut, userInfo} from './ApiReqests/ApiRequests'
import { useNavigate } from 'react-router-dom'

const ProfileInfo = function(props) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      async function getUserInfo() {

      getUserInfo()
  }, [])

  const navigate = useNavigate()
  function handleLogOutClick(){
    navigate('/signin')
    logOut()
  }
  if (!isLoading){
    return (
      <div className='profileInfo'>
          <p className='userName'>{userInformation.name}</p>
          <p className='userMail'>{userInformation.email}</p>
          <CommonBtn style={{marginTop: 50,backgroundColor: `#A7CDE0`}} onClick={handleLogOutClick} value='Выйти'/>
      </div>
    )
  } else return (<div>Помогите</div>)
}

export default ProfileInfo