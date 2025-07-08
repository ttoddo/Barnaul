import React from 'react'
import { Button } from "@headlessui/react"



const UserInfo = function(props) {
  return (
    <div className="w-full border-y-1 border-tDark first:border-t-0 min-h-[120px] flex justify-between">
        <div className="relative flex flex-col h-full w-full">
            <div className='h-[70px] w-full pl-[10px] pt-[10px] pr-[10px] flex justify-between'>
              <p className='w-6/12 text-[24px] text-tLight dark:text-tLightD'>{props.user.name}</p>
              <div className='h-full flex-col w-6/12'>
                <p className='text-tLight dark:text-tLightD text-[20px] text-right w-full'>{props.user.email}</p>
              </div>
            </div>
            <div className='h-fit w-full flex justify-between items-center px-[10px]'>
              <p className='text-tLight dark:text-tLightD text-[20px] transition duration-500 ease-in-out'>
                {props.user.role === "ROLE_ADMIN" ? "Администратор" : "Пользователь"}
              </p>
              <Button onClick={() => props.handleRemoveUser(props.user.id)} className=" rounded-[8px] h-[40px] w-2/12 bg-red hover:bg-red-600">
                <p className="w-full h-full text-tLight dark:text-tLightD text-[20px] py-1">Удалить</p>
              </Button>
            </div>
        </div>
    </div>
    // <div  className={styles.user}>
    //     <div className={styles.userText}>
    //         <p className={styles.userName}>{props.user.title}</p>
    //         <label className={styles.errorSubInfo}>
    //            <span>{props.user.role}</span>
    //             <span>{props.user.key}</span>
    //         </label>
    //     </div>
    // </div>
  )
}

export default UserInfo