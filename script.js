// Dynamic copyright year on the right
const copyright = document.getElementById("copyright");
if (copyright) {
  copyright.textContent = `Copyright © ${new Date().getFullYear()}`;
}

// ...existing code...
// Update the preview card with user inputs
function updatePreview() {
  document.getElementById('preview-song').textContent =
    document.getElementById('song').value || 'Song Name';
  document.getElementById('preview-artist').textContent =
    document.getElementById('artist').value || 'Artist Name';
  document.getElementById('preview-lyrics').textContent =
    document.getElementById('lyrics').value || 'Lyrics will appear here...';

  let img = document.getElementById('artist-image');
  let coverUrl = document.getElementById('cover-url').value;
  img.src =
    coverUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd2NAjCcjjk7ac57mKCQvgWVTmP0ysxnzQnQ&s';
  // Ensure crossOrigin is set
  img.setAttribute('crossorigin', 'anonymous');

  let cardWidth = document.getElementById('image-width').value;
  let borderRadius = document.getElementById('border-radius').value;
  document.getElementById('preview').style.width = cardWidth + 'px';
  document.getElementById('preview').style.borderRadius = borderRadius + 'px';
  document.getElementById('image-width-value').textContent = cardWidth;
  document.getElementById('radius-value').textContent = borderRadius;

  let textColor = document.getElementById('text-color').value;
  let bgColor = document.getElementById('bg-color').value;
  document.getElementById('preview').style.color = textColor;
  document.getElementById('preview').style.backgroundColor = bgColor;
}

// Generate and download the image from the preview card
function generateImage() {
  const previewElement = document.getElementById('preview');
  const borderRadius = document.getElementById('border-radius').value;

  html2canvas(previewElement, {
    useCORS: true,
    allowTaint: true,
    // Add a backgroundColor to handle transparency issues
    backgroundColor: document.getElementById('bg-color').value,
  }).then(canvas => {
    // Create a new canvas to apply rounded corners
    const roundedCanvas = document.createElement('canvas');
    const ctx = roundedCanvas.getContext('2d');
    roundedCanvas.width = canvas.width;
    roundedCanvas.height = canvas.height;

    // Draw rounded rectangle
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, parseInt(borderRadius));
    ctx.closePath();
    ctx.clip();

    // Draw the image onto the rounded rectangle
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

    let link = document.createElement('a');
    link.download = 'spotify-lyrics-card.png';
    link.href = roundedCanvas.toDataURL();
    link.click();
  });
}
