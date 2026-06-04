import { useCallback, useState, useEffect, useRef } from 'react';

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  
  const intervalRef = useRef(null);

  const calculateTimeLeft = useCallback(() => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      total: difference
    };
  }, [targetDate]);

  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Set up interval
    intervalRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Stop interval when countdown reaches zero
      if (newTimeLeft.total <= 0) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [calculateTimeLeft]);

  const isExpired = timeLeft.total <= 0;
  const formatTime = (value) => String(value).padStart(2, '0');

  return {
    ...timeLeft,
    isExpired,
    formatTime
  };
};
