import React, { useEffect, useState } from 'react'
import '../styles/Profile.css'
import { getBreakdowns, userInfo } from './ApiReqests/ApiRequests'

const ProfileDataReport = function(props) {
  const [breakdown, setBreakdowns] = useState()
  const [userInformation, setUserInfo] = useState()
  useEffect(() => {
      async function brbrbr(){
        let breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
        setBreakdowns(breakdowns)
      }
      async function getUserInfo() {
        let res = await userInfo(localStorage.getItem('TOKEN'))
        setUserInfo(res)
        }
      getUserInfo() 
      brbrbr()
  }, [])
  let solvedCount = 0
  let breakdownCount = 0
  if (breakdown && userInformation){
    for (let i = 0; i < breakdown.breakdowns.length; i++){
      if (breakdown.breakdowns[i].userId === userInformation.id){
        breakdownCount++
        if (breakdown.breakdowns[i].isSolved){solvedCount++}
      }
    }
    return (
      <div className='profileData'>
          <label className='errorFound'>Ошибок найдено: <span>{breakdownCount}</span></label>
          <label className='errorSolved'>Ошибок решено: <span>{solvedCount}</span></label>
      </div>
    )
  }
}

export default ProfileDataReport
