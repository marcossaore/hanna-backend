const handleKeyPress = (event, keyCode, callback) => {
  if (event.keyCode === keyCode) {
    callback();
  }
}