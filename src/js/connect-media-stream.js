module.exports = function connectMediaStream(callback) {
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
        console.log(err);
        callback(null, null);
      });
  } else {
    callback(new Error("navigator.mediaDevices not supported"));
  }
};
