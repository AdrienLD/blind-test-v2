import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PlaylistSelection from './PlaylistSelection/PlaylistSelection'
import Logo from './Components/Images/Songs-logo.png'
import BlindGame from './Components/BlindGame/BlindGame'
import CallBack from './Components/CallBack'
import PLParoles from './Components/PLParoles/PLParoles'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <img className='logo' src={Logo} alt="logo" />
    <div className="content">
      
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/ChoosePlaylist" element={<PlaylistSelection />} />
          <Route path="/callback" element={<CallBack/>} />
          <Route path="/BlindGame" element={<BlindGame/>} />
          <Route path='/PLParoles' element={<PLParoles/>} />
        </Routes>
      </Router>
    </div>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
