import cn from "classnames";
import useAudioLevelDetector from "../hooks/use-audio-level-detector";

interface AudioActivityIndicatorProps {
  classnames?: string;
  mediaStream: MediaStream;
}

export default function AudioActivityIndicator({
  mediaStream,
  classnames = "",
}: AudioActivityIndicatorProps) {
  const isSpeaking = useAudioLevelDetector(mediaStream, {
    threshold: 0.05,
    interval: 50,
  });
  return (
    <div
      className={cn(
        "outline outline-4 outline-white absolute top-0 right-0 bottom-0 left-0 rounded-lg transition-opacity box-content",
        isSpeaking
          ? "opacity-95 duration-0"
          : "opacity-0 delay-300 duration-300",
        classnames
      )}
    ></div>
  );
}
