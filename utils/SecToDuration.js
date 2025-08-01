function convertSecondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor((totalSeconds % 3600) % 60);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  } else if (minutes > 0) {
    return `${minutes} min ${seconds} sec`;
  } else {
    return `${seconds} sec`;
  }
}

module.exports = {
  convertSecondsToDuration,
};