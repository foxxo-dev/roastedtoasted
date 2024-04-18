function generateTermsPopup() {
  const popup = document.createElement('div');
  popup.classList.add('terms-popup');

  const content = document.createElement('div');
  content.classList.add('terms-content');
  content.innerHTML = `
    <h2>Terms and Conditions</h2>
    <p>
      By using this website, you agree to the following terms and conditions:
      </p>
      <a href="../terms/index.html">Read More</a>
`;

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.innerText = 'Accept';

  popup.appendChild(content);
  popup.appendChild(closeButton);

  return popup;
}
