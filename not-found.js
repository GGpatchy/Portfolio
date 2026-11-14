const channelNames = {
  instagram: "Instagram",
  x: "X",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  github: "GitHub",
};

const requestedChannel = new URLSearchParams(window.location.search)
  .get("channel")
  ?.toLowerCase();

if (requestedChannel && Object.prototype.hasOwnProperty.call(channelNames, requestedChannel)) {
  document.querySelector("[data-channel]").textContent = channelNames[requestedChannel];
}
