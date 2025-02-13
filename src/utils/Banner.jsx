import React, { useEffect, useState } from 'react';
import { intervalToDuration } from 'date-fns';
import AddButton from './AddButton';

// Function to calculate the next reset date (first of the next month)
const calculateNextResetDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
};

// Function to calculate the phase based on the reset date
const calculatePhase = (currentDate, resetDate) => {
  const phases = ['Distribution Phase 1', 'Distribution Phase 2', 'Distribution Phase 3']; // Example phases
  const phaseDuration = 30 * 24 * 60 * 60 * 1000; // Duration of each phase (30 days in milliseconds)
  const phaseIndex = Math.floor((resetDate - currentDate) / phaseDuration);
  return phases[phaseIndex] || 'Distribution Phase 1';
};

const CountdownBanner = ({userData}) => {
  const [countdown, setCountdown] = useState('');
  const [resetDate, setResetDate] = useState(calculateNextResetDate());
  const [phase, setPhase] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = resetDate - now;
      if (distance < 0) {
        setResetDate(calculateNextResetDate()); // Reset the date for the next month
      } else {
        const duration = intervalToDuration({ start: now, end: resetDate });
        const days = duration.days ?? 0;
        const hours = duration.hours ?? 0;
        const minutes = duration.minutes ?? 0;
        setCountdown(`${days}d ${hours}h ${minutes}m`);
        setPhase(calculatePhase(now, resetDate));
      }
    }, 1000);
    console.log(userData)

    return () => clearInterval(interval);
  }, [resetDate]);

  return (
    <div className="countdown-banner">
      <div className="banner-content">
        <div>
          <h1>Hexa Token Listing</h1>
          <p>Price: $0.10</p>
          <AddButton userData={userData} />
        </div>
        <div>
          <p>Countdown to Distribution</p>
          <div className="countdown-timer">
            {countdown.split(' ').map((unit, index) => (
              <div key={index} className="countdown-unit">
                <span className="countdown-value">{unit}</span>
                <span className="countdown-label">
                  {unit.endsWith('d') ? 'Days' : unit.endsWith('h') ? 'Hours' : 'Minutes'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;
