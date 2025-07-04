import React, { useCallback, useEffect, useState } from 'react'
import '../styles/Profile.css'
import { getBreakdowns, userInfo } from './ApiReqests/ApiRequests'

const ProfileDataReport = function(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [counts, setCounts]  = useState({count: 0, sCount: 0})

  const countBreakdowns = useCallback((brks, user) => {
    let count = 0
    let sCount = 0
    for (let i = 0; i < brks.length; i++){
      if (brks[i].userId === user.id) {
        count ++
        if (brks[i].isSolved){
          sCount++
        }
      }
    }
    return {count, sCount}
  }, [] )

  useEffect(() => {
      async function brbrbr(){
        let breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
        let res = await userInfo(localStorage.getItem('TOKEN'))
        
        let breakdownsCount = countBreakdowns(breakdowns.response, res)
        setCounts(breakdownsCount)
        setIsLoading(false)
      }

      brbrbr()
  }, [isLoading, counts])
  if (!isLoading){
    return (
      <div className='profileData'>
          <label className='errorFound'>Ошибок найдено: <span>{counts.count}</span></label>
          <label className='errorSolved'>Ошибок решено: <span>{counts.sCount}</span></label>
      </div>
    )
  }
  else return (<div>Помогите</div>)
}

export default ProfileDataReport
