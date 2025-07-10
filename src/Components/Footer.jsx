import { Switch, Field, Label } from '@headlessui/react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'

const Footer = function(props){
    const themes = {
        light: "flex items-center justify-between h-18 bg-bgDark transition-colors ease-in-out duration-500",
        dark: "flex items-center justify-between h-18 bg-bgDarkD transition-colors ease-in-out duration-500"
    }

    return (
        <div className={`${props.theme ? themes[props.theme] : themes["light"]}`}>
            <div className='ml-[25px]'>
                <p className='text-[48px] font-semibold text-tLight dark:text-tLightD transition ease-in-out duration-750'>© ВДК 2025</p>
            </div>
            <Field className='h-full flex items-center flex-col gap-[5px] mr-[25px]'>
                <Label className='text-tLight dark:text-tLightD'>Выбор темы</Label>
                <Switch checked={props.theme === 'dark' ? true : false} onChange={props.handleChange}
                    className='group inline-flex h-8 w-18 items-center rounded-full bg-bgLight dark:bg-bgLightD
                    cursor-pointer transition'
                >
                    <span className='relative size-6 translate-x-1 bg-bgLightD dark:bg-bgLight rounded-full transition duration-750 group-data-checked:translate-x-11'>
                        <MoonIcon className='absolute fill-white dark:fill-black size-5 rounded-full top-0.5 left-[1.5px]
                            duration-375 transition ease-out group-data-checked:scale-100 scale-0
                            group-data-checked:rotate-360'></MoonIcon>
                        <SunIcon className='absolute fill-white dark:fill-black size-5 rounded-full top-0.5 left-[1.5px]
                            duration-375 transition ease-out group-data-checked:scale-0 scale-100
                            rotate-360  group-data-checked:rotate-0'></SunIcon>
                    </span>
                </Switch>
            </Field>

        </div>
    )
}

export default Footer