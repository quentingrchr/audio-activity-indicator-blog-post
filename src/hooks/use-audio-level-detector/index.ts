import { useEffect, useRef, useState } from "react";
import { checkAudioLevel } from "./utils";

interface AudioLevelDetectorOptions {
  threshold?: number; // a number between 0 and 1, where 1 represents the maximum audio level and 0 represents the minimum audio level
  interval?: number;
}

const useAudioLevelDetector = (
  mediaStream: MediaStream | null,
  options: AudioLevelDetectorOptions = {}
): boolean => {
  const [isExceedingThreshold, setIsExceedingThreshold] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timeoutIdRef = useRef<number | null>(null);

  const threshold = options.threshold || 0.1;
  const interval = options.interval || 100;

  function onInterval() {
    if (!analyserRef.current) return;
    checkAudioLevel({
      threshold,
      analyser: analyserRef.current!,
      onExceedThreshold: () => {
        setIsExceedingThreshold(true);
      },
      onBelowThreshold: () => {
        setIsExceedingThreshold(false);
      },
    });
  }

  function onCleanUp() {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      // Close the audio context if it is not closed
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    analyserRef.current = null;
  }

  useEffect(() => {
    if (!mediaStream || !mediaStream.getAudioTracks().length) {
      setIsExceedingThreshold(false);
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)(); // Create an AudioContext, or a webkitAudioContext for Safari
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser(); // Create an AnalyserNode
    }

    const source = audioContextRef.current.createMediaStreamSource(mediaStream); // Add the media stream to the audio context
    source.connect(analyserRef.current); // Connect the source to the analyser

    timeoutIdRef.current = window.setInterval(onInterval, interval);
    onInterval();

    return () => {
      onCleanUp();
    };
  }, [mediaStream, threshold, interval]);

  return isExceedingThreshold;
};

export default useAudioLevelDetector;
