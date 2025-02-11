import React, { useEffect, useState } from 'react'
import '../styles/Profile.css'
import ErrorBlock from './UI/ErrorBlock/ErrorBlck'
import ErrorBlockSkeleton from './UI/ErrorBlock/ErrorBlckSkeleton'
import { getBreakdowns, userInfo } from './ApiReqests/ApiRequests'

const ProfileStatistic = function(props) {
    const [isLoading, setIsLoading] = useState(true) // Здесь состояние загрузки, которое мы меняем после выполнения запросов
    const [userInformation, setUserInfo] = useState()
    const [breakdown, setBreakdowns] = useState()
    const [error, setError] = useState([])
    function byLevel(a, b){
      return b.level - a.level;
    }

    useEffect(() => { // ВСЕ ИЗМЕНЕНИЯ СМОТРИ В ErrorBlock/ErrorBlckSkeleton И ВСЁ ОСТАЛЬНОЕ ДЕЛАЕМ ТАКЖЕ
        async function getUserAndBreakdowns() { // Здесь я объединил две функции, которые получают инфу о пользователе и ошибках, так надо делать для одного изменения состояния загрузки.
            function sleep(ms) {
              return new Promise(resolve => setTimeout(resolve, ms));
            } // Эту функцию удалишь, как разберешься, как это работает, либо можно взять на вооружение для тестов скелетов, оно просто вместо записи сраузу, ждет время в миллисекундах. 
            let token = localStorage.getItem('TOKEN') // Наш токен, который потом перенесем в cookies
            let user = await userInfo(token)
            let breakdowns = await getBreakdowns(token) // Два запроса

            setUserInfo(user)
            setBreakdowns(breakdowns) // Запись запросов в состояния
            await sleep(10000) // Это удалишь, как разберешься, как это работает
            setIsLoading(false) // Тут мы меняем состояние загрузки == загрузка закончилась. Все изменения состояний проводят обновление вкладки, но так как прошлые set функции изменялись,
                                // но isLoading был false, мы не попадали во вторую часть кода только с данными пользователя.
        }
        getUserAndBreakdowns()
    }, [])

    if (isLoading){ // Проверка состояния загрузки
      return (
        <div className='profileStat'>
          <ErrorBlockSkeleton key={0}></ErrorBlockSkeleton> 
          <ErrorBlockSkeleton key={1}></ErrorBlockSkeleton>
        </div>
      ) // Тут я навалил грязи с ErrorBlock, но выглядит оно нормально
    } else { // Сюда попадем только в случае, если загрузка кончилась 
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
      ) // А тут выводится уже нормальный ErrorBlock
    }
}

export default ProfileStatistic
