import React, { useEffect, useState } from 'react'
import CommonBtn from './UI/CommonButton/CommonBtn'
import '../styles/Profile.css'
import {logOut, userInfo} from './ApiReqests/ApiRequests'
import { useNavigate } from 'react-router-dom'

const ProfileInfo = function(props) {
  const [userInformation, setUserInfo] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      async function getUserInfo() {
          let res = await userInfo(localStorage.getItem('TOKEN'))
          console.log(res)
          setUserInfo(res)
          setIsLoading(false)
          }
      getUserInfo()
  }, [isLoading, userInformation])

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