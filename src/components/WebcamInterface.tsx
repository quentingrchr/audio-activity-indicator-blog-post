import {
  BiCamera,
  BiCameraOff,
  BiMicrophone,
  BiMicrophoneOff,
} from "react-icons/bi";

import React, { useEffect } from "react";
import AudioActivityIndicator from "./AudioActivityIndicator";

interface WebcamInterfaceProps {
  cameraMuted: boolean;
  microphoneMuted: boolean;
  mediaStream: MediaStream | null;
  onCameraToggle: () => void;
  onMicrophoneToggle: () => void;
  devices: MediaDeviceInfo[];
  onDeviceChange: (device: MediaDeviceInfo, kind: MediaDeviceKind) => void;
}

const WebcamInterface: React.FC<WebcamInterfaceProps> = ({
  cameraMuted,
  microphoneMuted,
  mediaStream,
  onCameraToggle,
  devices,
  onMicrophoneToggle,
  onDeviceChange,
}) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, videoRef]);

  const videoDevices = React.useMemo(() => {
    return devices.filter((device) => device.kind === "videoinput");
  }, [devices]);

  const audioDevices = React.useMemo(() => {
    return devices.filter((device) => device.kind === "audioinput");
  }, [devices]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-neutral-800 p-6 rounded-lg shadow-md">
        <div className="relative mb-4">
          {!cameraMuted && mediaStream ? (
            <div className="relative w-96 h-72 rounded-sm object-cover">
              <AudioActivityIndicator mediaStream={mediaStream} />
              <video
                ref={videoRef}
                className="bg-black rounded-lg w-full h-full"
                autoPlay
                playsInline
              />
            </div>
          ) : (
            <div className="w-96 h-72 bg-neutral-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">Camera Off</span>
            </div>
          )}
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={onCameraToggle}
            className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white focus:outline-non"
          >
            {cameraMuted ? (
              <BiCameraOff className="size-6" />
            ) : (
              <BiCamera className="size-6" />
            )}
          </button>
          <button
            onClick={onMicrophoneToggle}
            className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white focus:outline-none"
          >
            {microphoneMuted ? (
              <BiMicrophoneOff className="size-6" />
            ) : (
              <BiMicrophone className="size-6" />
            )}
          </button>
        </div>
        <div className="flex flex-col justify-start">
          <fieldset className="flex items-center space-x-4">
            <label className="text-white text-lg w-1/2">Select a camera:</label>
            <select
              className="w-1/2 px-4 py-2 focus:outline-none max-w-[15ch] bg-neutral-800 text-white"
              onChange={(e) =>
                onDeviceChange(
                  videoDevices.find(
                    (device) => device.deviceId === e.target.value
                  )!,
                  "videoinput"
                )
              }
            >
              {videoDevices.map((device) => (
                <option
                  className="bg-neutral-800 text-white"
                  key={device.deviceId}
                  value={device.deviceId}
                >
                  {device.label}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="flex items-center space-x-4">
            <label className="text-white text-lg w-1/2">
              Select a microphone:
            </label>
            <select
              className="w-1/2 px-4 py-2 focus:outline-none max-w-[15ch] bg-neutral-800 text-white"
              onChange={(e) =>
                onDeviceChange(
                  audioDevices.find(
                    (device) => device.deviceId === e.target.value
                  )!,
                  "audioinput"
                )
              }
            >
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default WebcamInterface;
