import { useState, useRef, useEffect } from 'react';

export const useAudio = (src, options = {}) => {
  const {
    loop = true,
    autoplay = false,
    volume = 1
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audioRef.current = audio;

    // Set audio properties
    audio.loop = loop;
    audio.volume = volume;

    // Event listeners
    const handleCanPlayThrough = () => {
      setIsLoading(false);
      if (autoplay) {
        play();
      }
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [src, loop, autoplay, volume]);

  const play = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.log('Audio play failed:', err);
      setError('Playback failed');
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (newVolume) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = clampedVolume;
  };

  const seek = (time) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
  };

  return {
    isPlaying,
    isLoading,
    error,
    play,
    pause,
    toggle,
    setVolume,
    seek
  };
};
