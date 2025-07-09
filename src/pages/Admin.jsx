import React, { useCallback, useEffect, useState } from 'react'
import { getUsers, removeUser } from '../Components/ApiReqests/ApiRequests'
import { getBreakdowns, userInfo, getComputers, addUser } from '../Components/ApiReqests/ApiRequests'
import { Button, Input, Dialog, DialogTitle, DialogPanel, Fieldset, Field, Label, Checkbox } from '@headlessui/react'
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import UserInfo from '../Components/UI/UserInfo/UserInfo'
import admin from '../icons/admin.svg'
import adminD from '../icons/adminD.svg'


const Admin = () => {
  let theme = localStorage.getItem('THEME')

  const [isLoading, setIsLoading] = useState(true)
  const [count, setCounts]  = useState(0)
  const [userInf, setUserInfo] = useState()
  const [computersCount, setComputersCount] = useState(0)
  const [isRemove, setIsRemove] = useState(false)
  const [idToRemove, setIdToRemove] = useState(null)
  const [isAddUser, setIsAddUser] = useState(false)
  const [users, setUsers] = useState()

  const [showPass, setShowPass] = useState(false)

  const [name, setName] = useState()
  const [mail, setMail] = useState()
  const [pass, setPass] = useState()
  const [isAdmin, setIsAdmin] = useState(false)
  const [addUsr, setAddUsr] = useState(false)

  useEffect(() => {
      async function brbrbr(){
        if (isRemove) {
          await removeUser(idToRemove, localStorage.getItem('TOKEN'))
          setIsRemove(false)
        }
        if (addUsr) {
          let res = await addUser(name, mail, pass, isAdmin ? "ROLE_ADMIN" : "ROLE_USER")
          if (res) {
            setIsAddUser(false)
          }
          setAddUsr(false)
        }
        let breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
        let userInf = await userInfo(localStorage.getItem('TOKEN'))
        let comps = await getComputers(localStorage.getItem('TOKEN'))
        let usrs = await getUsers(localStorage.getItem('TOKEN'))
        setUsers(usrs.response)
        setComputersCount(comps.response.length)
        setUserInfo(userInf)
        setCounts(breakdowns.response.length)
        setIsLoading(false)
      }

      brbrbr()
  }, [isRemove, addUsr, isLoading])

  const handleRemoveUser = (id) => {
    setIdToRemove(id)
    setIsRemove(true)
  }

  const handleAddUser = () => {
    setAddUsr(true)
  }

  if (!isLoading) {
    return (
      <div className='bg-bgMiddle dark:bg-bgMiddleD w-full min-h-screen pt-[15px] transition ease-in-out duration-500'>
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
                <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">{users.length}</dd>
              </div>
              <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Ошибок</dt>
                <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">{count}</dd>
              </div>
              <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500">Компьютеров</dt>
                <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">{computersCount}</dd>
              </div>
              <div className="px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-tLight dark:text-tLightD font-bold transition ease-in-out duration-500 pt-2">Список пользователей</dt>
                <dd className="text-tLight dark:text-tLightD transition ease-in-out duration-500">
                  <Button className="h-[40px] w-[260px] bg-primary dark:bg-primaryD transition ease-in-out duration-500 rounded-[8px]
                    hover:duration-0 hover:scale-105 active:scale-100" onClick={() => setIsAddUser(true)}>
                    <p className='text-tLight dark:text-tLightD transition ease-in-out duration-500'>
                      Добавить пользователя
                    </p>
                  </Button>
                </dd>
              </div>
              <div className='rouned-[8px] pt-4 mb-[20px]'>
                <div className='h-[480px] overflow-auto'>
                  {users.map(user => (
                    <UserInfo key={user.id.toString()} user={user} handleRemoveUser={handleRemoveUser}/>
                  ))}
                </div>
              </div>
            </dl>
          </div>
        </div>
        <Dialog open={isAddUser} as="div" data-theme={theme} className="absolute z-20 focus:outline-none" onClose={() => setIsAddUser(false)}>
          <div className="relative focus:outline-none">
              <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] inset-0 max-h-screen flex items-center justify-center">
                  <DialogPanel transition
                      className="w-full h-full max-w-2xl max-h-screen flex flex-col items-center justify-center
                          rounded-[16px] bg-bgModal dark:bg-bgModalD duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                  >
                      <DialogTitle className="w-full pl-[30px] pr-[30px] pt-[30px] flex flex-row justify-between gap-[20x] mb-[30px]">
                          <p className="font-semibold text-[32px] text-tLight dark:text-tLightD py-1.5">Добавление пользователя</p>
                          <div className="size-[60px] bg-bgLight dark:bg-bgLightD rounded-[8px] hover:scale-110 active:scale-105" onClick={() => setIsAddUser(false)}>
                              <XMarkIcon className="size-[60px] fill-black dark:fill-white" />
                          </div>
                      </DialogTitle>
                      <Fieldset className="h-full space-y-[20px] w-full px-[30px]">
                          <Field>
                              <Label className="font-bold text-[20px] text-tLight dark:text-tLightD space-y-15">
                                  Имя пользователя
                              </Label>
                              <Input onChange={e => setName(e.target.value)} placeholder='Введите имя пользователя' className="placeholder:text-tDark w-full h-[45px] outline-none bg-bgMiddle dark:bg-bgMiddleD
                                transition duration-500 ease-in-out rounded-[8px] px-4 text-tLight dark:text-tLightD"/>
                          </Field>
                          <Field>
                              <Label className="font-bold text-[20px] text-tLight dark:text-tLightD outline-none">Почта</Label>
                              <Input onChange={e => setMail(e.target.value)} placeholder='Введите почту' className="placeholder:text-tDark w-full h-[45px] outline-none bg-bgMiddle dark:bg-bgMiddleD
                                transition duration-500 ease-in-out rounded-[8px] px-4 text-tLight dark:text-tLightD"/>
                          </Field>
                          <Field className="relative">
                              <Label className="font-bold text-[20px] text-tLight dark:text-tLightD outline-none">Пароль</Label>
                              <Input onChange={e => setPass(e.target.value)} placeholder='Введите пароль' className="placeholder:text-tDark w-full h-[45px] outline-none bg-bgMiddle dark:bg-bgMiddleD
                                transition duration-500 ease-in-out rounded-[8px] px-4 text-tLight dark:text-tLightD" type={showPass ? "text" : "password"}/>
                              <Checkbox onChange={setShowPass}
                                  className="group absolute size-[35px] top-[35px] right-[10px] rounded-full hover:bg-bgModal dark:hover:bg-bgModalD flex justify-center items-center">
                                  <EyeIcon className='size-[30px] absolute scale-0 group-data-checked:scale-100 transition duration-100 fill-tDark'/>
                                  <EyeSlashIcon className='size-[30px] absolute group-data-checked:scale-0 transition duration-100 fill-tDark'/>
                              </Checkbox>
                          </Field>
                          <Field>
                              <div className='flex flex-row gap-4 items-center'>
                                <Checkbox onChange={setIsAdmin}
                                    className="group size-[40px]  bg-bgDark dark:bg-bgDarkD flex justify-center items-center rounded-[8px]">
                                    <img src={theme === 'dark' ? admin : adminD} alt="ad" className='select-none size-[35px] group-data-checked:scale-100 
                                      group-data-checked:rotate-360 rotate-0 scale-0 transition duration-250'/>
                                </Checkbox>
                                <p className='text-tDark'>Администратор</p>
                              </div>
                          </Field>
                          <Field>
                              <Button className="bg-primary dark:bg-primaryD h-[40px] w-[190px] mt-[10px] mb-[40px] rounded-[8px] active:scale-105 hover:scale-110
                                  text-[20px] text-tLight dark:text-tLightD" onClick={handleAddUser}>
                                  Добавить
                              </Button>
                          </Field>
                      </Fieldset>
                  </DialogPanel>
              </div>
          </div>
      </Dialog> 
      </div>
    )
  } else {
    return (
      <div className='bg-bgMiddle dark:bg-bgMiddleD h-[calc(100vh-144px)]'>Шкилет</div>
    )
  }

}

export default Admin