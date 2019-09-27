function initMap() {
  // Map options
  var options = {
    zoom: 11,
    center: { lat: 42.699, lng: 23.349 }
  };
  // Initializing variables
  var map = new google.maps.Map(document.getElementById('map'), options);
  var geocoder = new google.maps.Geocoder();
  var input = document.getElementById('adress');
  var autocomplete = new google.maps.places.Autocomplete(input);
  var marker = new google.maps.Marker({
    map: map,
    icon: '/images/placeholder.png'
  });
  // Add Event listener to add a marker on click
  google.maps.event.addListener(map, 'click', function (event) {
    marker.setPosition(event.latLng);
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    var latLng = {
      lat: lat,
      lng: lng
    };
    // Change lat/lng to google's api formatted adress text and assign it to the input input - adress
    geocoder.geocode({ location: latLng }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          document.getElementById('adress').value =
            results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  });
  // Autocomplete places suggestions from Google API
  autocomplete.addListener('place_changed', function () {
    var place = autocomplete.getPlace();
    map.fitBounds(place.geometry.viewport);
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
  });
}
// Validating from data and decide to push it or not to the localStorage
function validateFormData() {
  var users = JSON.parse(localStorage.getItem('users') || '[]');
  // Check if its the first push to the localStorage
  if (users[0] === undefined) {
    pushFormData(users);
    alert('The form is saved successfully')
    form.reset();
  } else {
    // Check if any of the emails in the localStorage and display an error message
    var isEqual = false;
    for (var i = 0; i < users.length; i++) {
      if (document.getElementById('email').value === users[i].email) {
        setInvalid(email, 'Email is already registered');
        isEqual = true;
        return false;
      }
    }
    if (isEqual === false) {
      pushFormData(users);
      alert('The form is saved successfully')
      form.reset();
    }
  }
  // Change the object to string to be able to save the data as in JS looks
  var JSONReadyUsers = JSON.stringify(users);
  // Push the array to the localstorage
  localStorage.setItem('users', JSONReadyUsers);
}
// push the form data the the localStorage
function pushFormData(users) {
  users.push({
    name: document.getElementById('name').value,
    adress: document.getElementById('adress').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    website: document.getElementById('website').value
  });
}
// Input inputs
const name = document.getElementById('name');
const adress = document.getElementById('adress');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const website = document.getElementById('website');
const nameRegex = /^[a-zA-Z0-9_.-]*$/;
const phoneRegex = /[+]{1}[0-9]{3}[0-9]{9}/;
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/im;
const websiteRegex = /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

// Form 
const form = document.getElementById('googleMapForm');
// Handle form
form.addEventListener('submit', function (event) {
  // Prevent default behaviour for the form submit
  event.preventDefault();
  if (
    validateName() &&
    validateAdress() &&
    validateEmail() &&
    validatePhone() &&
    validateWebsite()
  ) {
    validateFormData();
  }
});
// Validation Functions
function validateName() {
  if (checkIfEmpty(name)) return;
  if (!checkNameToValidate(name)) return;
  return true;
}
function validateEmail() {
  if (checkIfEmpty(email)) return;
  if (!checkEmailToValidate(email)) return;
  return true;
}
function validateAdress() {
  if (checkIfEmpty(adress)) return;
  return true;
}
function validatePhone() {
  if (checkIfEmpty(phone)) return;
  if (!checkPhoneToValidate(phone)) return;
  return true;
}
function validateWebsite() {
  if (checkIfEmpty(website)) return;
  if (!checkWebsiteToValidate(website)) return;
  return true;
}
function checkIfEmpty(input) {
  if (isEmpty(input.value.trim())) {
    // set input invalid
    setInvalid(input, `${input.name} must not be empty`);
    return true;
  } else {
    // set input valid
    setValid(input);
    return false;
  }
}
function isEmpty(value) {
  if (value === '') return true;
  return false;
}
function setInvalid(input, message) {
  input.className = 'invalidInput';
  input.nextElementSibling.innerHTML = message;
}
function setValid(input) {
  input.className = 'validInput';
  input.nextElementSibling.innerHTML = '';
}
function checkNameToValidate(input) {
  if (nameRegex.test(input.value)) {
    setValid(input);
    return true;
  } else {
    setInvalid(input, "Name can't have special caracters different than . - _");
    return false;
  }
}
function checkEmailToValidate(input) {
  if (emailRegex.test(input.value)) {
    setValid(input);
    return true;
  } else {
    setInvalid(input, "Please enter a valid email adress");
    return false;
  }
}
function checkPhoneToValidate(input) {
  if (phoneRegex.test(input.value)) {
    setValid(input);
    return true;
  } else {
    setInvalid(input, "Match the phone format 3 digits for country code and 9 digits phone number- +359888123456`");
    return false;
  }
}
function checkWebsiteToValidate(input) {
  if (websiteRegex.test(input.value)) {
    setValid(input);
    return true;
  } else {
    setInvalid(input, 'Please enter a valid website url');
    return false;
  }
}

