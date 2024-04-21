export function updateDropdown(data, dropdown) {
  dropdown.innerHTML = '';
  const option = document.createElement('option');
  option.innerHTML = '--Select--';
  option.setAttribute('selected', '');
  option.setAttribute('disabled', '');
  dropdown.appendChild(option);
  data.forEach((element) => {
    console.log('Adding element to dropdown:', element);
    const option = document.createElement('option');
    option.innerHTML = element;
    dropdown.appendChild(option);
  });
}
