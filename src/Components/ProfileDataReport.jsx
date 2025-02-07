import React from 'react'
import '../styles/Profile.css'

const ProfileDataReport =function(props) {
  return (
    <div className='profileData'>
        <label className='errorFound'>Ошибок найдено: <span>14</span></label>
        <label className='errorSolved'>Ошибок решено: <span>88</span></label>
        
    </div>
  )
}

export default ProfileDataReport
