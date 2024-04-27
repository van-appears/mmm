module.exports = function connectAudio(callback) {
  const MEDIA_CONSTRAINTS = {
    audio: true,
    video: false
  };

  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia(MEDIA_CONSTRAINTS)
      .then(function (mediaStream) {
        callback(null, mediaStream);
      })
      .catch(function (err) {
        callback(err);
      });
  } else {
    callback(new Error("navigator.mediaDevices not supported"));
  }
};
