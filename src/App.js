import React, { useState } from 'react';
import './styles/App.css'
import Header from './Components/Header';
import LoginForm from './pages/LoginForm';
import Footer from './Components/Footer';
import Main from './Components/Main'
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header/>
      <Main/>
      <Footer/>
    </div>
  );
}

export default App;
