import React, { use, useEffect, useState} from 'react'
import hidePass from '../icons/hidePass.svg'
import { getUser } from '../Components/ApiReqests/ApiRequests.jsx'
import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Field, Fieldset, Input, Label, Legend } from '@headlessui/react'
import { EyeIcon } from '@heroicons/react/24/solid'
import { EyeSlashIcon } from '@heroicons/react/24/solid'




const LoginForm = function(props){
    const [name, setName] = useState('')
    const [pass, setPass] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [passInfo, setPassInfo] = useState(false)
    const [error, setError] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        console.log(name, pass)
        async function signin(username, password) {
            let res = await getUser(name, pass)
            if (res) {
                navigate('/')
                window.location.reload()
            }
            else setError(false)
            setIsLogin(false)
        }
        if (isLogin) {
            signin(name, pass)
        }
        
    }, [isLogin])
    return (
        <div className="w-full h-[calc(100vh-144px)] bg-bgMiddle dark:bg-bgMiddleD transition duration-500 ease-in-out flex justify-center items-center">
            <Fieldset className="space-y-[20px] rounded-[16px] bg-bgModal dark:bg-bgModalD transition duration-500 ease-in-out w-lg py-[20px] px-[60px]">
                <Legend className="w-full text-center font-bold text-[48px] text-tLight dark:text-tLightD transition duration-500 ease-in-out">Вход</Legend>
                <Field>
                    <Label className="text-[20px] font-semibold text-tLight dark:text-tLightD transition duration-500 ease-in-out">Имя пользователя</Label>
                    <Input placeholder='Введите имя пользователя' className="placeholder:text-tDark w-full h-[45px] outline-none bg-bgMiddle dark:bg-bgMiddleD
                        transition duration-500 ease-in-out rounded-[8px] px-4 text-tLight dark:text-tLightD" onChange={e => setName(e.target.value)}/>
                </Field>
                <Field className="relative">
                    <Label className="text-[20px] font-semibold text-tLight dark:text-tLightD transition duration-500 ease-in-out">Пароль</Label>
                    <Input placeholder='Введите пароль' className=" placeholder:text-tDark w-full h-[45px] outline-none bg-bgMiddle dark:bg-bgMiddleD
                        transition duration-500 ease-in-out rounded-[8px] px-4 text-tLight dark:text-tLightD" onChange={e => setPass(e.target.value)} type={showPass ? "text" : "password"}/>
                    <Checkbox onChange={setShowPass}
                        className="group absolute size-[35px] top-[35px] right-[10px] rounded-full hover:bg-bgModal dark:hover:bg-bgModalD flex justify-center items-center">
                        <EyeIcon className='size-[30px] absolute scale-0 group-data-checked:scale-100 transition duration-100 fill-tDark'/>
                        <EyeSlashIcon className='size-[30px] absolute group-data-checked:scale-0 transition duration-100 fill-tDark'/>
                    </Checkbox>
                </Field>
                <Field>
                    <p onClick={() => setPassInfo(!passInfo)}
                    className={passInfo ? "text-tLight dark:text-tLightD w-full text-center cursor-pointer text-[14px] transition duration-500 ease-in-out" :
                        "text-tDark underline w-full text-center cursor-pointer text-[14px]"}>
                        {passInfo ? "Вспоминайте :D" : "Утерян пароль"}
                    </p>
                </Field>
                <Field>
                    <Button onClick={() => setIsLogin(!isLogin)} className="w-full bg-primary dark:bg-primaryD hover:scale-102 active:scale-100 transition-colors duration-500 ease-in-out h-[45px] rounded-[8px]">
                        <p className='font-semibold text-[20px] text-tLight dark:text-tLightD transition duration-500 ease-in-out'>Войти</p>
                    </Button>
                    <p hidden={!error} className='w-full text-red text-[14px] pt-5 text-center'>
                        Неправильный логин или пароль
                    </p>
                </Field>
            </Fieldset>
        </div>
    )
}

export default LoginForm