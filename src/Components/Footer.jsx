import { Switch, Field, Label } from '@headlessui/react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import React, { useCallback, useEffect, useState } from 'react'

const Footer = function(props){
    const themes = {
        light: "flex items-center justify-between fixed bottom-0 min-w-screen h-18 bg-bgDark transition-colors ease-in-out duration-500",
        dark: "flex items-center justify-between fixed bottom-0 min-w-screen h-18 bg-bgDarkD transition-colors ease-in-out duration-500"
    }

    return (
        <div className={`${themes[props.theme]}`}>
            <div className='ml-[25px]'>
                <p className='text-[48px] font-semibold text-tLight dark:text-tLightD'>© ВДК 2025</p>
            </div>
            <Field className='h-full flex items-center flex-col gap-[5px] mr-[25px]'>
                <Label className='text-tLight dark:text-tLightD'>Темная тема</Label>
                <Switch checked={props.theme === 'dark' ? true : false} onChange={props.handleChange}
                    className='group inline-flex h-8 w-14 items-center rounded-full bg-bgLight dark:bg-bgLightD
                    cursor-pointer transition'
                >
                    <span className='relative size-6 translate-x-1 bg-bgLightD dark:bg-bgLight rounded-full transition duration-500 group-data-checked:translate-x-7'>
                        <MoonIcon className='absolute fill-white dark:fill-black size-5 rounded-full top-0.5 left-0.5
                            duration-250 transition ease-out group-data-checked:scale-100 scale-0
                            group-data-checked:rotate-360'></MoonIcon>
                        <SunIcon className='absolute fill-white dark:fill-black size-5 rounded-full top-0.5 left-0.5
                            duration-250 transition ease-out group-data-checked:scale-0 scale-100
                            rotate-360  group-data-checked:rotate-0'></SunIcon>
                    </span>
                </Switch>
            </Field>

        </div>
    )
}

export default Footer