import { useEffect } from "react";
import WebcamInterface from "./components/WebcamInterface";
import useMediaStream from "./hooks/use-media-stream";

function App() {
  const {
    mediaStream,
    error,
    getMediaStream,
    updateMediaStreamMutedState,
    fetchUserDevices,
    devices,
    selectedDevice,
    setSelectedDevice,
    mutedState: { camera: isCameraOff, microphone: isMicrophoneOff },
  } = useMediaStream({
    audio: true,
    video: true,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        {mediaStream && (
          <WebcamInterface
            cameraMuted={isCameraOff}
            microphoneMuted={isMicrophoneOff}
            mediaStream={mediaStream}
            onCameraToggle={() => {
              updateMediaStreamMutedState({
                camera: !isCameraOff,
                microphone: isMicrophoneOff,
              });
            }}
            onMicrophoneToggle={() => {
              updateMediaStreamMutedState({
                camera: isCameraOff,
                microphone: !isMicrophoneOff,
              });
            }}
            devices={devices}
            onDeviceChange={(device, kind) => {
              setSelectedDevice({
                ...selectedDevice,
                [kind]: device,
              });
            }}
          />
        )}
        {!mediaStream && (
          <div className="bg-neutral-800 p-6 rounded-lg shadow-md w-full flex justify-center">
            <button
              onClick={async () => {
                await fetchUserDevices();
                await getMediaStream();
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full focus:outline-none"
            >
              Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
