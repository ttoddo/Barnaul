
import React, { useCallback, useEffect, useState } from 'react'
import ProfileStatistic from '../Components/ProfileStatistic'
import { getBreakdowns, userInfo } from '../Components/ApiReqests/ApiRequests'



const Profile = function(props){
  const [isLoading, setIsLoading] = useState(true)
  const [counts, setCounts]  = useState({count: 0, nsCount: 0})
  const [userInf, setUserInfo] = useState()

  const countBreakdowns = useCallback((brks, user) => {
    let count = 0
    let nsCount = 0
    for (let i = 0; i < brks.length; i++){
      if (brks[i].userId === user.id) {
        count ++
        if (!brks[i].isSolved){
          nsCount++
        }
      }
    }
    return {count, nsCount}
  }, [] )

  useEffect(() => {
      async function brbrbr(){
        let breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
        let userInf = await userInfo(localStorage.getItem('TOKEN'))
        
        let breakdownsCount = countBreakdowns(breakdowns.response, userInf)
        setUserInfo(userInf)
        setCounts(breakdownsCount)
        setIsLoading(false)
      }

      brbrbr()
  }, [])

  if (!isLoading) {
      return (
        <div className='bg-bgMiddle dark:bg-bgMiddleD w-full h-full pt-[15px] transition ease-in-out duration-500'>
          {/* <ProfileInfo/>
          <ProfileDataReport/> */}
          <div className='w-[1140px] ml-auto mr-auto'>
            <h3 className='text-[48px] font-semibold text-tLight dark:text-tLightD transition ease-in-out duration-500 mb-[40px]'>
              Профиль пользователя
            </h3>
            <div >
              <dl className='divide-y divide-tDark border-t-tDark border-t-[1px]'>
                <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Имя пользователя</dt>
                  <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">{userInf.name}</dd>
                </div>
                <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Почта</dt>
                  <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">{userInf.email}</dd>
                </div>
                <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Найдено ошибок</dt>
                  <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">{counts.count}</dd>
                </div>
                <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Нерешенных ошибок</dt>
                  <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">{counts.nsCount}</dd>
                </div>
                <div className="py-8 ">
                  <dt className="mb-4 text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Список найденных ошибок</dt>
                  <div className='rounded-[8px] mb-[97px] pt-4'>
                    <ProfileStatistic isComputer={false}/>
                  </div>
                </div>
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

export default Profile