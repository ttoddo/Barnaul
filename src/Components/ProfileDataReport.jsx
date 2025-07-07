import React, { useCallback, useEffect, useState } from 'react'
import { getBreakdowns, userInfo } from './ApiReqests/ApiRequests'

const ProfileDataReport = function(props) {
  if (!isLoading){
    return (
      <div className='profileData'>
          <label className='errorFound'>Ошибок найдено: <span>{counts.count}</span></label>
          <label className='errorSolved'>Ошибок решено: <span>{counts.sCount}</span></label>
      </div>
    )
  }
  else return (<div>Помогите</div>)
}

export default ProfileDataReport
