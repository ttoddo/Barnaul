import React from 'react'
import AdminCreateUser from '../Components/AdminCreateUser'
import '../styles/Admin.css'
import '../styles/App.css'
import AdminEditUser from '../Components/AdminEditUser'
import AdminUsersInfo from '../Components/AdminUsersInfo'



const Admin = () => {
  return (
    <div className='adminBlock'>
      <AdminCreateUser/>
      <AdminEditUser/>
      <AdminUsersInfo/>
    </div>
  )
}

export default Admin