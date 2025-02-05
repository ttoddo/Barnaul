import React from "react";
import {Routes, Route} from 'react-router-dom';

import LoginForm from "../pages/LoginForm";
import Profile from '../pages/Profile'

const Main = () => {
    return (
        <Routes>
            <Route exact path='/signin' element={<LoginForm/>}></Route>
            <Route exact path='/profile' element={<Profile/>}></Route>
        </Routes>
    )
}

export default Main