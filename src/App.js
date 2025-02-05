import React, { useState } from 'react';
import './styles/App.css'
import Header from './Components/Header';
import LoginForm from './Components/LoginForm';
import Footer from './Components/Footer';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header/>
      <LoginForm/>
      <Footer/>
    </div>
  );
}

export default App;
