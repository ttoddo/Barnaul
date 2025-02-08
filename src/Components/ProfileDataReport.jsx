import React, { useEffect, useState } from 'react'
import '../styles/Profile.css'
import { userInfo, getBreakdowns } from './ApiReqests/ApiRequests'

const ProfileDataReport = function(props) {
  const [userInformation, setUserInfo] = useState()
  const [breakdown, setBreakdowns] = useState()
  useEffect(() => {
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      async function getUserInfo() {
          var res = await userInfo(localStorage.getItem('TOKEN'))
          setUserInfo(res)
      }
      async function brbrbr(){
        console.log('Прокнуло')
        var breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
        setBreakdowns(breakdowns)
      }
      getUserInfo()
      sleep(10000)
      brbrbr()
  }, [])
  var solvedCount = 0


  if (breakdown){
    for (var i = 0; i < breakdown.breakdowns.length; i++){
      if (breakdown.breakdowns[i].isSolved){
        solvedCount++
      }
    }
    return (
      <div className='profileData'>
          <label className='errorFound'>Ошибок найдено: <span>{breakdown.breakdowns.length}</span></label>
          <label className='errorSolved'>Ошибок решено: <span>{solvedCount}</span></label>
      </div>
    )
  }
}

export default ProfileDataReport
