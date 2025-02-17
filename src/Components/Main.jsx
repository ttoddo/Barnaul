import React from "react";
import {Routes, Route} from 'react-router-dom';

import LoginForm from "../pages/LoginForm";
import Profile from '../pages/Profile';
import Admin from '../pages/Admin';
import HomePage from '../Components/UI/HomePage/HomePage';
import Editor from '../pages/Editor'

const Main = () => {
    return (
        <Routes>
            <Route exact path='' element={<HomePage/>}></Route>
            <Route exact path='/editor' element={<Editor height={window.height} width={window.width}></Editor>}></Route>
            <Route exact path='/signin' element={<LoginForm/>}></Route>
            <Route exact path='/profile' element={<Profile/>}></Route>
            <Route exact path='/admin' element={<Admin/>}></Route>
        </Routes>
    )
}

export default Main
