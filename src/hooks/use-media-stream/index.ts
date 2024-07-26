import { useEffect, useState } from "react";

interface MutedState {
  microphone: boolean;
  camera: boolean;
}

const useMediaStream = (
  initialConstraints: MediaStreamConstraints = { audio: true, video: true }
) => {
  const [hasAuthorized, setHasAuthorized] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<
    Partial<Record<MediaDeviceKind, MediaDeviceInfo>>
  >({});

  const [error, setError] = useState<Error | null>(null);
  const [mutedState, setMutedState] = useState<MutedState>({
    microphone: !initialConstraints.audio,
    camera: !initialConstraints.video,
  });

  function getConstraints() {
    const constraints: MediaStreamConstraints = { audio: true, video: true };
    if (selectedDevice.audioinput) {
      constraints.audio = { deviceId: selectedDevice.audioinput.deviceId };
    }
    if (selectedDevice.videoinput) {
      constraints.video = { deviceId: selectedDevice.videoinput.deviceId };
    }

    return constraints;
  }

  const getMediaStream = async () => {
    if (stream) {
      // Stop all tracks in the current stream
      stream.getTracks().forEach((track) => track.stop());
    }
    try {
      const userStream = await navigator.mediaDevices.getUserMedia(
        getConstraints()
      );
      setStream(userStream);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    }
  };

  const updateMediaStreamMutedState = async (newMutedState: MutedState) => {
    let needNewStream = false;

    try {
      // We only need a new stream if the camera is being unmuted, because we can just toggle the track's enabled state otherwise
      // Toggling the track's enabled state is faster and doesn't require a new stream but it doesn't work when the camera is being unmuted
      if (
        newMutedState.camera !== mutedState.camera &&
        newMutedState.camera === false
      ) {
        needNewStream = true;
      }

      if (!needNewStream) {
        stream
          ?.getAudioTracks()
          .forEach((track) => (track.enabled = !newMutedState.microphone));
        stream
          ?.getVideoTracks()
          .forEach((track) => (track.enabled = !newMutedState.camera));
        setMutedState(newMutedState);
      } else {
        // Stop all tracks in the current stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        // Get a new stream with the updated constraints
        const newStream = await navigator.mediaDevices.getUserMedia(
          getConstraints()
        );
        if (newMutedState.camera) {
          newStream
            .getVideoTracks()
            .forEach((track) => (track.enabled = !newMutedState.camera));
        }
        if (newMutedState.microphone) {
          newStream
            .getAudioTracks()
            .forEach((track) => (track.enabled = !newMutedState.microphone));
        }

        setStream(newStream);
        setMutedState(newMutedState);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update media stream")
      );
    }
  };

  async function fetchUserDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDevices(devices);
      setHasAuthorized(true);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to enumerate devices")
      );
      setHasAuthorized(false);
    }
  }

  useEffect(() => {
    if (!hasAuthorized) return;

    getMediaStream();
  }, [selectedDevice]);

  return {
    mediaStream: stream,
    error,
    getMediaStream,
    updateMediaStreamMutedState,
    mutedState,
    fetchUserDevices,
    devices,
    selectedDevice,
    setSelectedDevice,
  };
};

export default useMediaStream;
