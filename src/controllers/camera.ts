export const getMediaStream = async (): Promise<MediaStream | undefined> => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { width: 160, height: 144 },
    });
  } catch {
    return undefined;
  }
};

export const createVideoElement = (
  userMedia: MediaStream
): HTMLVideoElement => {
  const videoElement = document.createElement("video");
  videoElement.srcObject = userMedia;
  videoElement.play();
  videoElement.controls = true;
  videoElement.style.display = "none";
  return videoElement;
};

export const stopVideoElement = (videoElement: HTMLVideoElement): void => {
  const stream = videoElement.srcObject as MediaStream;

  if (!stream) return;

  videoElement.pause();
  const tracks = stream.getTracks();
  tracks.forEach((track) => track.stop());
  videoElement.srcObject = null;
  videoElement.remove();
};
