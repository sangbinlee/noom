// domFocus.js

window.addEventListener("DOMContentLoaded", () => {
  const roomInput = document.querySelector('#welcome input[type="text"]');

  console.log('■ ■ ■ ■ autofocus')
  if (roomInput) {
    roomInput.focus();
  }
});
