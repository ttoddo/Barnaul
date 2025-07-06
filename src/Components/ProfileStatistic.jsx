import React, { useCallback, useEffect, useState } from 'react'
import '../styles/Profile.css'
import ErrorBlock from './UI/ErrorBlock/ErrorBlck'
import ErrorBlockSkeleton from './UI/ErrorBlock/ErrorBlckSkeleton'
import { getBreakdowns, userInfo } from './ApiReqests/ApiRequests'

const ProfileStatistic = function(props) {
    const [isLoading, setIsLoading] = useState(true) // Здесь состояние загрузки, которое мы меняем после выполнения запросов
    const [error, setError] = useState([])
    function byLevel(a, b){
      return b.level - a.level;
    }

    const collectBreakdown = (breakdownInner, user) => {
      let _color = ''
      let _status
      let level = breakdownInner.level
      if (breakdownInner.isSolved){
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
      let date = breakdownInner.createdAt.split(" ")[0]
      let time = breakdownInner.createdAt.split(" ")[1]
      return {key: breakdownInner.id, title: breakdownInner.description, date, time,
                      username: user.name, status: _status, color: _color, level: level}
    }

    const parseErrors = useCallback((breakdowns, user, isComputer, hardnessF, statusF) => {
        let tempError = []
        if (isComputer){ // Проверка, для компьютера ли мы собираем данные. Этот компонент теперь используется в профиле и в модалке в редакторе.
          for (let i = 0; i < breakdowns.length; i++){
            if (breakdowns[i].computerId.toString() === props.computerId){
              let tempBrk = collectBreakdown(breakdowns[i], user) // Функция сборки в json выше
              tempError.push(tempBrk)
            }
          }
        } else {
          for (let i = 0; i < breakdowns.length; i++){
            if (breakdowns[i].userId === user.id){
              let tempBrk = collectBreakdown(breakdowns[i], user)
              tempError.push(tempBrk)
            }
          }
        }
        if (tempError.length > 1){
          tempError.sort(byLevel);
        }
        switch (hardnessF){
          case "all":
            break;
          case "hard":
            tempError = tempError.filter(err => err.level === 3)
            break;
          case "medium":
            tempError = tempError.filter(err => err.level === 2)
            break;
          case "easy":
            tempError = tempError.filter(err => err.level === 1)
            break;
        }
        switch (statusF){
          case "all":
            break;
          case "notSolved":
            tempError = tempError.filter(err => err.status === 'Not Solved')
            break;
          case "solved":
            tempError = tempError.filter(err => err.status === 'Solved')
            break;
        }
        return tempError
    }, [])

    useEffect(() => { // ВСЕ ИЗМЕНЕНИЯ СМОТРИ В ErrorBlock/ErrorBlckSkeleton И ВСЁ ОСТАЛЬНОЕ ДЕЛАЕМ ТАКЖЕ
        async function getUserAndBreakdowns() { // Здесь я объединил две функции, которые получают инфу о пользователе и ошибках, так надо делать для одного изменения состояния загрузки.
            function sleep(ms) {
              return new Promise(resolve => setTimeout(resolve, ms));
            } // Эту функцию удалишь, как разберешься, как это работает, либо можно взять на вооружение для тестов скелетов, оно просто вместо записи сраузу, ждет время в миллисекундах. 
            let token = localStorage.getItem('TOKEN') // Наш токен, который потом перенесем в cookies
            let user = await userInfo(token)
            let breakdowns = await getBreakdowns(token) // Два запроса
            
            // await sleep(5000) // Это удалишь, как разберешься, как это работает
            let parsedErrors = parseErrors(breakdowns.response, user, props.isComputer, props.hardnessFilter, props.statusFilter) // Здесь мы собираем ошибки, полученные в запросе в нормальный вид
            setError(parsedErrors) // А тут уже устанавливаем их и только после этого сообщаем, что загрузка завершена.
            setIsLoading(false) // Тут мы меняем состояние загрузки == загрузка закончилась. Все изменения состояний проводят обновление вкладки, но так как прошлые set функции изменялись,
                                // но isLoading был false, мы не попадали во вторую часть кода только с данными пользователя.
        }
        getUserAndBreakdowns()
    }, [])

    if (isLoading){ // Проверка состояния загрузки
      return (
        <div className='w-full h-[250px] overflow-y-scroll no-scrollbar bg-bgLight dark:bg-bgLightD'>
          <ErrorBlockSkeleton key={0}></ErrorBlockSkeleton> 
          <ErrorBlockSkeleton key={1}></ErrorBlockSkeleton>
        </div>
      )
    } else { // Сюда попадем только в случае, если загрузка кончилась 
      return (
        <div className='w-full h-[480px] overflow-y-scroll no-scrollbar bg-bgLight dark:bg-bgLightD flex flex-col rounded-[8px]'>
            {error.map(error => 
                <ErrorBlock error={error} key={error.key}/>
            )}
        </div>
      ) // А тут выводится уже нормальный ErrorBlock
    }
}

export default ProfileStatistic
