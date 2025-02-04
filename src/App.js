import React from 'react';
import './styles/App.css'
import Header from './Components/Header';
import LoginForm from './Components/LoginForm';
import Footer from './Components/Footer';

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
