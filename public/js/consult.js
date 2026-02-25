navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    document.getElementById("video").srcObject = stream;
  });