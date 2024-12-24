const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clearSignature");
const saveButton = document.getElementById("saveSignature");
const signatureInput = document.getElementById("signature");
const signatureError = document.getElementById('signatureError');

// Resize canvas to match parent width
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = 100; // Set canvas height
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;

function startDrawing(event) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
  canvas.style.cursor = "crosshair"; // Change cursor to crosshair during drawing
}

function draw(event) {
  if (!drawing) return;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.strokeStyle = "black"; // Set line color
  ctx.lineWidth = 2; // Set line width
  ctx.lineCap = "round"; // Smooth line endings
  ctx.stroke();
}

function stopDrawing() {
  drawing = false;
  canvas.style.cursor = "default"; // Reset cursor to default after drawing
}

// Clear canvas when the button is clicked
clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Event listeners for canvas interactions
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Clear Signature
clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveButton.addEventListener("click", () => {
    const signatureData = canvas.toDataURL("image/png"); // Convert canvas to Base64
    signatureInput.value = signatureData;  // Set Base64 in hidden input
    console.log(signatureData);  // Optionally log the Base64 data
    alert("Signature has been uploaded.");
});

function validateSignature() {
    if (signatureInput.value === "") {
        signatureError.style.display = 'block'; // Show error message
    } else {
        signatureError.style.display = 'none'; // Hide error message
    }
}

// Save signature event
saveButton.addEventListener('click', validateSignature);

// Get location
function getLocation() {
  const output = document.getElementById("location-output");
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");

  if (!navigator.geolocation) {
    output.textContent = "आपल्या ब्राउझरमध्ये स्थान समर्थन उपलब्ध नाही.";
    return;
  }

  output.textContent = "स्थान शोधत आहे...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude.toFixed(6);
      const longitude = position.coords.longitude.toFixed(6);

      latitudeInput.value = latitude;
      longitudeInput.value = longitude;

      const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      output.innerHTML = `
                <b>रुंदी:</b> ${latitude}, <br>
                <b>लांबी:</b> ${longitude} <br>
                <a href="${googleMapsLink}" target="_blank" class="btn btn-link p-0">Google Maps वर पहा</a>
            `;
    },
    (error) => {
      output.textContent = `स्थान मिळवता आले नाही: ${error.message}`;
    }
  );
}
