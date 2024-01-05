const showFlashMessage = ({
  content,
  type = 'critical',
  delay = 3000
}) => {

  const backgroundColor = `var(--${type})`;
  const textColor = 'var(--white)';

  const flashMessage = `<div class="flash-message" style="background-color:${backgroundColor}; color:${textColor}"> 
  <p class="flash-message-text">
      ${content}
    </p>
  </div>
  `
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = flashMessage;
  document.body.appendChild(tempContainer.firstChild);

  setTimeout(() => {
    const flashMessageElement = document.querySelector(".flash-message");
    if (flashMessageElement) {
      flashMessageElement.remove();
    }
  }, delay);
}