import React, { useEffect, useState } from 'react'
import '../styles/Profile.css'
import ErrorBlock from './UI/ErrorBlock/ErrorBlck'
import { getBreakdowns, userInfo } from './ApiReqests/ApiRequests'

const ProfileStatistic = function(props) {
    const [userInformation, setUserInfo] = useState()
    const [breakdown, setBreakdowns] = useState()
    const [error, setError] = useState([])
    useEffect(() => {
        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function getUserInfo() {
            var res = await userInfo(localStorage.getItem('TOKEN'))
            await sleep(1000)
            setUserInfo(res)
        }
        async function brbrbr(){
          console.log('Прокнуло')
          var breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
          await sleep(1000)
          setBreakdowns(breakdowns)
        }
        getUserInfo()
        brbrbr()
    }, [])
    if (breakdown && userInformation){
      if (error.length !== breakdown.breakdowns.length){
        var tempError = []
        for (var i = 0; i < breakdown.breakdowns.length; i++){
          var _color = ''
          if (breakdown.breakdowns[i].isSolved){
            var _status = 'Solved'
          } else _status = 'Not Solved'
          if (_status === 'Solved') {
            _color = '#2eff27'
          } else {
          switch (breakdown.breakdowns[i].level){
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
          }}
          console.log(breakdown.breakdowns[i].description)
          tempError = [...tempError, {key: breakdown.breakdowns[i].id, title: breakdown.breakdowns[i].description, date: breakdown.breakdowns[i].date, username: userInformation.username, status: _status, color: _color}]
        }
        setError(tempError)
      }
      return (
        <div className='profileStat'>
            {error.map(error => 
                <ErrorBlock error={error}/>
            )}
            
        </div>
      )
    }
}

export default ProfileStatistic