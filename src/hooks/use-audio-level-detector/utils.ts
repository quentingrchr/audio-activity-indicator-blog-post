/**
 * Check if the audio level is exceeding the threshold
 */
export function isAudioLevelExceedingThreshold({
  threshold,
  analyser,
}: {
  threshold: number;
  analyser: AnalyserNode;
}) {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  const average =
    dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
  const normalizedValue = average / 255;

  return normalizedValue > threshold;
}

/**
 * Check the audio level and call the appropriate callback based on the threshold
 */
export function checkAudioLevel({
  threshold,
  analyser,
  onExceedThreshold,
  onBelowThreshold,
}: {
  threshold: number;
  analyser: AnalyserNode;
  onExceedThreshold: () => void;
  onBelowThreshold: () => void;
}) {
  if (isAudioLevelExceedingThreshold({ threshold, analyser })) {
    onExceedThreshold();
  } else {
    onBelowThreshold();
  }
}
