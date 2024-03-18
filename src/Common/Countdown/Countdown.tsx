import React, { useState, useEffect } from 'react'
import './Countdown.sass'

interface CountdownProps {
  duration: number
  onFinish: () => void
}

function Countdown({ duration, onFinish }: CountdownProps){
  const [ timeLeft, setTimeLeft ] = useState(duration)
  const radius = 150
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 15
        if (newTime <= 0) {
          clearInterval(interval)
          onFinish()
          return 0
        } 
        return newTime

      })
    }, 10)
    return () => clearInterval(interval)
  }, [  ])
  
  const strokeDashoffset = ((timeLeft / duration) * circumference)

  const strokeWidth = 10

  const viewBoxSize = radius * 2 + strokeWidth

  return (
    <div className="countdown">
      <div className="circle-container">
        <h1 className='timeLeft'>{(timeLeft / 1000).toFixed(2)}</h1>
        <svg width={viewBoxSize} height={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius - strokeWidth / 2}
            fill="none"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
          />
        </svg>
      </div>
    </div>
  )
}

export default Countdown