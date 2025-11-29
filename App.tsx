import React, { useState} from 'react';
import Login from './src/screens/Login';
import Splash from './src/screens/Splash';
import Register from './src/screens/Register';
import Main from './src/screens/Main';

export default function App() {

  const [showSplash, setShowSplash] = useState(true);
  const [CurrentScreen, setCurrentScreen] = useState('Login');
  const [currentUser, setCurrentUser] = useState(null);

  if (showSplash){
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  if (CurrentScreen === 'Register'){
    return <Register onBackToLogin={() => {
      console.log('Cambiando a Login desde Register');
      setCurrentScreen('Login');
    }} />;
  }

  if (CurrentScreen === 'Home'){
    return <Main 
      user={currentUser} 
      onLogout={() => {
        setCurrentUser(null);
        setCurrentScreen('Login');
      }} 
    />;
  }

  return <Login
    onGoToRegister={() => setCurrentScreen('Register')}
    onLoginSuccess={(user) => {
      setCurrentUser(user);
      setCurrentScreen('Home');
    }}
  />
}