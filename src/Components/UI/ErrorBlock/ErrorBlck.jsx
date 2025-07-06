import React from 'react'
import { Button } from '@headlessui/react'



const ErrorBlock = function(props) {
  return (
    <div className="w-full border-y-1 border-tDark first:border-t-0 min-h-[120px] flex justify-between">
        <div className="relative flex flex-col h-full w-full">
            <div className="absolute top-[10px] left-[10px] rounded-full size-[35px]" style={{backgroundColor: props.error.color}}></div>
            <div className='h-[70px] w-full pl-[75px] pt-[10px] pr-[10px] flex justify-between'>
              <p className='w-10/12 text-[24px] text-tLight dark:text-tLightD'>{props.error.title}</p>
              <div className='h-full flex-col w-2/12'>
                <p className='text-tLight dark:text-tLightD text-[20px] text-right w-full'>{props.error.username}</p>
                <p className='text-tLight dark:text-tLightD text-[13px] text-right w-full'>{props.error.time} <span className='text-tDark text-[13px]'>{props.error.date}</span></p>
              </div>
            </div>
            <div className='h-fit w-full flex justify-between items-center px-[10px]'>
              <Button className={props.error.status === 'Solved' ? "rounded-[8px] h-[40px] w-3/12 bg-primary dark:bg-primaryD hover:scale-105 active:scale-100" :
                  "rounded-[8px] h-[40px] w-3/12 bg-bgMiddle dark:bg-bgMiddleD hover:scale-105 active:scale-100"}
              >
                <p className='w-full h-full text-tLight dark:text-tLightD text-[20px] py-1'>{props.error.status === 'Solved' ? "Исправлено" : "Не исправлено"}</p>
              </Button>
              <Button className=" rounded-[8px] h-[40px] w-2/12 bg-red hover:bg-red-600 hover:scale-105 active:scale-100">
                <p className="w-full h-full text-tLight dark:text-tLightD text-[20px] py-1">Удалить</p>
              </Button>
            </div>
        </div>
    </div>
  )
}

export default ErrorBlock
