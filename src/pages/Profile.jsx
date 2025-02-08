
import React, { useState, useEffect } from 'react'
import ProfileInfo from '../Components/ProfileInfo'
import '../styles/Profile.css'
import '../styles/App.css'
import ProfileDataReport from '../Components/ProfileDataReport'
import ProfileStatistic from '../Components/ProfileStatistic'



const Profile = function(props){
  return (
    <div className='profileBlock'>
      <ProfileInfo/>
      <ProfileDataReport/>
      <ProfileStatistic/>
    </div>
  )
}

export default Profile