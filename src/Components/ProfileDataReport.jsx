import React, { useEffect, useState } from 'react'
import '../styles/Profile.css'
import { getBreakdowns, userInfo } from './ApiReqests/ApiRequests'

const ProfileDataReport = function(props) {
  const [breakdown, setBreakdowns] = useState()
  const [userInformation, setUserInfo] = useState()
  useEffect(() => {
      async function brbrbr(){
        var breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
        setBreakdowns(breakdowns)
      }
      async function getUserInfo() {
        var res = await userInfo(localStorage.getItem('TOKEN'))
        setUserInfo(res)
        }
      getUserInfo() 
      brbrbr()
  }, [])
  var solvedCount = 0
  var breakdownCount = 0
  if (breakdown && userInformation){
    for (var i = 0; i < breakdown.breakdowns.length; i++){
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
