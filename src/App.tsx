import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  function redirectToSpotifyLogin() {
    const clientId = "bbbe51c137b24687a4edb6c27fbb5dac";
    const redirectUri = encodeURIComponent("http://localhost:3000/callback");
    const scopes = encodeURIComponent("user-read-private user-read-email");
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
  }
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={redirectToSpotifyLogin}>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
