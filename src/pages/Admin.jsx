import React, { useState } from 'react'
import AdminCreateUser from '../Components/AdminCreateUser'
import '../styles/Admin.css'
import '../styles/App.css'
import AdminEditUser from '../Components/AdminEditUser'
import AdminUsersInfo from '../Components/AdminUsersInfo'
import { removeUser } from '../Components/ApiReqests/ApiRequests'



const Admin = () => {
  const [seed, setSeed] = useState(1)
  function reset(){
    setSeed(Math.random())
  }
  async function handleRemoveUser(id) {
    await removeUser(id, localStorage.getItem('TOKEN'))
    reset()
  } 
  return (
    <div className='adminBlock'>
      <AdminCreateUser reset={reset}/>
      <AdminEditUser reset={reset}/>
      <AdminUsersInfo key={seed} remove={handleRemoveUser}/>
    </div>
  )
}

export default Admin