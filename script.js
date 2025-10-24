const uploadInput = document.getElementById('imageUpload');
const preview = document.getElementById('preview');
const predictBtn = document.getElementById('predictBtn');
const resultBox = document.getElementById('result');

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    preview.style.display = 'block';
    predictBtn.disabled = false;
  };
  reader.readAsDataURL(file);
});

predictBtn.addEventListener('click', async () => {
  resultBox.textContent = 'Analyzing...';
  const file = uploadInput.files[0];
  if (!file) { resultBox.textContent = 'No image selected.'; return; }

  // Replace this URL with your backend inference endpoint
  const BACKEND_URL = 'https://your-backend-url/predict';

  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(BACKEND_URL, { method: 'POST', body: formData });
    if (!res.ok) {
      const text = await res.text();
      throw new Error('Server error: ' + text);
    }
    const data = await res.json();
    // Expected JSON format: { label: "Melanoma", confidence: 0.92 }
    resultBox.textContent = `Prediction: ${data.label} (${(data.confidence*100).toFixed(1)}%)`;
  } catch (err) {
    console.error(err);
    resultBox.textContent = 'Error: could not get prediction. Check backend URL and console.';
  }
});
