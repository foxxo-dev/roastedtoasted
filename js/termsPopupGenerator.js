import '../scss/popup.css';

export function generateTermsPopup() {
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
  closeButton.addEventListener('click', () => {
    // Store the acceptance status in local storage
    localStorage.setItem('termsAccepted', 'true');
    // Remove the popup from the DOM
    document.body.removeChild(popup);
  });

  // Check if the terms have already been accepted
  const termsAccepted = localStorage.getItem('termsAccepted');
  if (termsAccepted === 'true') {
    // Terms have already been accepted, so don't show the popup
    return;
  }

  popup.appendChild(content);
  popup.appendChild(closeButton);

  document.body.appendChild(popup);
}
