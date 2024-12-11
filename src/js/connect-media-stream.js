export default function connectMediaStream(callback) {
  const MEDIA_CONSTRAINTS = {
    audio: true,
    video: false
  };

  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia(MEDIA_CONSTRAINTS)
      .then(function (mediaStream) {
        callback(mediaStream);
      })
      .catch(function (err) {
        console.log(err);
        callback(null);
      });
  } else {
    console.log("navigator.mediaDevices not supported");
    callback(null);
  }
}
