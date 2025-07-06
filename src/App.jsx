import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Main from './Components/Main'


function App() {
  const [theme, setTheme] = useState()
  useEffect(() => {
    let takeTheme
    try {
      takeTheme = localStorage.getItem('THEME')
    } catch {
      takeTheme = 'light'
    }
    setTheme(takeTheme)
  }, [])
  const handleChange = (e) => {
    setTheme(e ? 'dark' : 'light')
    localStorage.setItem('THEME', e ? 'dark' : 'light')
  }

  return (
    <div className="App" data-theme={theme}>
      <Header theme={theme}/>
      <Main theme={theme}/>
      <Footer handleChange={handleChange} theme={theme}/>
    </div>
  );
}

export default App;