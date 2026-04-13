export function createAudio() {
  const protocol = window.location.protocol;
  return new Audio(`${protocol}//${window.location.host}/public/sounds/ns_0_03.mp3`);
}

export function enableAudioOnClick(audio) {
  window.addEventListener("click", () => {
    audio.play().catch((err) => console.error("권한 획득 실패:", err));
  }, { once: true });
}
