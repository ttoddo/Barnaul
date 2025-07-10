import React, { useCallback, useEffect, useState } from 'react'
import ErrorBlock from './UI/ErrorBlock/ErrorBlck'
import { getBreakdowns, userInfo, changeBreakdown, deleteBreakdown } from './ApiReqests/ApiRequests'

const ProfileStatistic = function(props) {
    const [isLoading, setIsLoading] = useState(true) // Здесь состояние загрузки, которое мы меняем после выполнения запросов
    const [error, setError] = useState([])
    const [breakdownSolve, setBreakdownSolve] = useState(false)
    const [solveId, setSolveId] = useState()
    const [solveState, setSoveState] = useState()
    const [brekadownDelete, setBreakdownDelete] = useState()
    const [deleteId, setDeleteId] = useState()

    function byLevel(a, b){
      return b.level - a.level;
    }

    const collectBreakdown = (breakdownInner) => {
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
                      userId: breakdownInner.userId, status: _status, color: _color, level: level}
    }

    const parseErrors = useCallback((breakdowns, user, isComputer, hardnessF, statusF) => {
        let tempError = []
        if (isComputer){ // Проверка, для компьютера ли мы собираем данные. Этот компонент теперь используется в профиле и в модалке в редакторе.
          for (let i = 0; i < breakdowns.length; i++){
            if (breakdowns[i].computerId.toString() === props.computerId){
              let tempBrk = collectBreakdown(breakdowns[i]) // Функция сборки в json выше
              tempError.push(tempBrk)
            }
          }
        } else {
          for (let i = 0; i < breakdowns.length; i++){
            if (breakdowns[i].userId === user.id){
              let tempBrk = collectBreakdown(breakdowns[i])
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
            if (breakdownSolve) {
              let res = await changeBreakdown(token, solveId, solveState)
              setBreakdownSolve(false)
            }
            if (brekadownDelete){
              let res = await deleteBreakdown(token, deleteId)
              setBreakdownDelete(false)
            }

            setError(parsedErrors) // А тут уже устанавливаем их и только после этого сообщаем, что загрузка завершена.
            setIsLoading(false) // Тут мы меняем состояние загрузки == загрузка закончилась. Все изменения состояний проводят обновление вкладки, но так как прошлые set функции изменялись,
                                // но isLoading был false, мы не попадали во вторую часть кода только с данными пользователя.
        }
        getUserAndBreakdowns()
    }, [breakdownSolve, brekadownDelete])

    const handleBreakdownSolve = (currState, id) => {
      setBreakdownSolve(true)
      setSolveId(id)
      setSoveState(!currState)
    }
    const handleBreakdownDelete = (id) => {
      setBreakdownDelete(true)
      setDeleteId(id)
    }

    if (isLoading){ // Проверка состояния загрузки
      return (
        <div className='w-full h-[250px] overflow-y-scroll no-scrollbar bg-bgLight dark:bg-bgLightD transition duration-500 ease-in-out'>
        </div>
      )
    } else { // Сюда попадем только в случае, если загрузка кончилась 
      return (
        <div className="w-full h-[480px] overflow-y-scroll no-scrollbar bg-bgLight dark:bg-bgLightD flex flex-col rounded-[8px] transition ease-out duration-500">
            {error.map(error => 
                <ErrorBlock breakdownSolve={handleBreakdownSolve} deleteBreakdown={handleBreakdownDelete} error={error} key={error.key}/>
            )}
        </div>
      ) // А тут выводится уже нормальный ErrorBlock
    }
}

export default ProfileStatistic
