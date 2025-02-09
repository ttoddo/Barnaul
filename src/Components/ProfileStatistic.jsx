import React, { useEffect, useState } from 'react'
import '../styles/Profile.css'
import ErrorBlock from './UI/ErrorBlock/ErrorBlck'
import { getBreakdowns, userInfo } from './ApiReqests/ApiRequests'

const ProfileStatistic = function(props) {
    const [userInformation, setUserInfo] = useState()
    const [breakdown, setBreakdowns] = useState()
    const [error, setError] = useState([])
    useEffect(() => {
        async function getUserInfo() {
            let res = await userInfo(localStorage.getItem('TOKEN'))
            setUserInfo(res)
        }
        async function brbrbr(){
          let breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
          setBreakdowns(breakdowns)
        }
        getUserInfo()
        brbrbr()
    }, [])
    function byLevel(a, b){
      return b.level - a.level;
    }
    if (breakdown && userInformation){
      let error_count = 0;
      for (let i = 0; i < breakdown.breakdowns.length; i++){
        if (breakdown.breakdowns[i].userId === userInformation.id){
          error_count++
        }
      }
      if (error.length !== error_count){
        let tempError = []
        for (let i = 0; i < breakdown.breakdowns.length; i++){
          if (breakdown.breakdowns[i].userId === userInformation.id){
            let _color = ''
            let _status
            let level = breakdown.breakdowns[i].level
            if (breakdown.breakdowns[i].isSolved){
               _status = 'Solved'
            } else {_status = 'Not Solved'}
            if (_status === 'Solved') {
              level = 0
            } else {}
            switch (level){
              case 0:
                _color = '#2eff27';
                break;
              case 1:
                _color = '#FDBE21';
                break;
              case 2:
                _color = '#FF7033';
                break;
              case 3:
                _color = '#FF3C3C';
                break;
              default:
                console.log('Backender needs to be punished.')
            }
            tempError = [...tempError, {key: breakdown.breakdowns[i].id, title: breakdown.breakdowns[i].description, date: breakdown.breakdowns[i].date,
                            username: userInformation.username, status: _status, color: _color, level: level}]
          }
        }
        if (tempError.length > 1){
          tempError.sort(byLevel);
        }
        setError(tempError)
      }
      return (
        <div className='profileStat'>
            {error.map(error => 
                <ErrorBlock error={error} key={error.key}/>
            )}
            
        </div>
      )
    }
}

export default ProfileStatistic