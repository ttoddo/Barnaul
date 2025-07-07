import React, { useCallback, useEffect, useState } from 'react'
import { removeUser } from '../Components/ApiReqests/ApiRequests'
import { getBreakdowns, userInfo } from '../Components/ApiReqests/ApiRequests'



const Admin = () => {
  const [seed, setSeed] = useState(1)
  function reset(){
    setSeed(Math.random())
  }
  async function handleRemoveUser(id) {
    await removeUser(id, localStorage.getItem('TOKEN'))
    reset()
  } 
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCounts]  = useState(0)
  const [userInf, setUserInfo] = useState()

  useEffect(() => {
      async function brbrbr(){
        let breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
        let userInf = await userInfo(localStorage.getItem('TOKEN'))
        
        let breakdownsCount = breakdowns.response.length
        setUserInfo(userInf)
        setCounts(breakdownsCount)
        setIsLoading(false)
      }

      brbrbr()
  }, [])

  if (!isLoading) {
    return (
      <div className='bg-bgMiddle dark:bg-bgMiddleD w-full h-[calc(100vh-144px)] pt-[15px] transition ease-in-out duration-500'>
        {/* <ProfileInfo/>
        <ProfileDataReport/> */}
        <div className='w-[1140px] ml-auto mr-auto'>
          <h3 className='text-[48px] font-semibold text-tLight dark:text-tLightD transition ease-in-out duration-500 mb-[40px]'>
            Профиль администратора
          </h3>
          <div >
            <dl className='divide-y divide-tDark border-t-tDark border-t-[1px]'>
              <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Пользователей</dt>
                <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">{userInf.name}</dd>
              </div>
              <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Ошибок</dt>
                <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">{count}</dd>
              </div>
              <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Найдено ошибок</dt>
                <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500"></dd>
              </div>
              <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Нерешенных ошибок</dt>
                <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500"></dd>
              </div>
              {/* <div className="py-8 ">
                <dt className="mb-4 text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Список найденных ошибок</dt>
                <div className='rounded-[8px] mb-[97px] pt-4'>
                  <ProfileStatistic isComputer={false}/>
                </div>
              </div> */}
            </dl>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='bg-bgMiddle dark:bg-bgMiddleD h-[calc(100vh-144px)]'>Шкилет</div>
    )
  }

}

export default Admin