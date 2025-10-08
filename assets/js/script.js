// Performance optimization: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Dynamic copyright year
const copyright = document.getElementById("copyright");
if (copyright) {
  copyright.textContent = `Copyright © ${new Date().getFullYear()}`;
}

// Cache DOM elements for better performance
const elements = {
  previewSong: document.getElementById('preview-song'),
  previewArtist: document.getElementById('preview-artist'),
  previewLyrics: document.getElementById('preview-lyrics'),
  artistImage: document.getElementById('artist-image'),
  preview: document.getElementById('preview'),
  imageWidthValue: document.getElementById('image-width-value'),
  radiusValue: document.getElementById('radius-value'),
  song: document.getElementById('song'),
  artist: document.getElementById('artist'),
  coverUrl: document.getElementById('cover-url'),
  lyrics: document.getElementById('lyrics'),
  imageWidth: document.getElementById('image-width'),
  borderRadius: document.getElementById('border-radius'),
  textColor: document.getElementById('text-color'),
  bgColor: document.getElementById('bg-color')
};

// Optimized update function using cached elements
function updatePreview() {
  // Update text content
  elements.previewSong.textContent = elements.song.value || 'Song Name';
  elements.previewArtist.textContent = elements.artist.value || 'Artist Name';
  elements.previewLyrics.textContent = elements.lyrics.value || 'Lyrics will appear here...';

  // Update image with error handling
  const coverUrl = elements.coverUrl.value;
  if (coverUrl && coverUrl !== elements.artistImage.src) {
    elements.artistImage.onerror = () => {
      elements.artistImage.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd2NAjCcjjk7ac57mKCQvgWVTmP0ysxnzQnQ&s';
    };
    elements.artistImage.src = coverUrl;
  } else if (!coverUrl) {
    elements.artistImage.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd2NAjCcjjk7ac57mKCQvgWVTmP0ysxnzQnQ&s';
  }
  
  // Ensure crossOrigin for canvas compatibility
  elements.artistImage.setAttribute('crossorigin', 'anonymous');

  // Update dimensions and styles
  const cardWidth = elements.imageWidth.value;
  const borderRadius = elements.borderRadius.value;
  
  elements.preview.style.width = `${cardWidth}px`;
  elements.preview.style.borderRadius = `${borderRadius}px`;
  elements.imageWidthValue.textContent = cardWidth;
  elements.radiusValue.textContent = borderRadius;

  // Update colors
  elements.preview.style.color = elements.textColor.value;
  elements.preview.style.backgroundColor = elements.bgColor.value;
}

// Debounced version for input events
const debouncedUpdatePreview = debounce(updatePreview, 100);

// Keyboard accessibility helper
function handleKeyDown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    generateImage();
  }
}

// Generate and download the image from the preview card
function generateImage() {
  const previewElement = elements.preview;
  const borderRadius = elements.borderRadius.value;
  
  // Show loading state
  const button = document.querySelector('.btn-download');
  const originalText = button.innerHTML;
  button.innerHTML = '<span class="btn-icon">⏳</span>Generating...';
  button.disabled = true;

  try {
    html2canvas(previewElement, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: elements.bgColor.value,
      scale: 2, // Higher quality
      logging: false, // Disable console logs for better performance
    }).then(canvas => {
      try {
        // Create a new canvas to apply rounded corners
        const roundedCanvas = document.createElement('canvas');
        const ctx = roundedCanvas.getContext('2d');
        roundedCanvas.width = canvas.width;
        roundedCanvas.height = canvas.height;

        // Draw rounded rectangle
        ctx.beginPath();
        ctx.roundRect(0, 0, canvas.width, canvas.height, parseInt(borderRadius) * 2);
        ctx.closePath();
        ctx.clip();

        // Draw the image onto the rounded rectangle
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

        // Generate filename with timestamp
        const songName = elements.song.value || 'song';
        const artistName = elements.artist.value || 'artist';
        const filename = `${songName}-${artistName}-lyrics-card.png`.replace(/[^a-z0-9.-]/gi, '_');

        // Create download link
        const link = document.createElement('a');
        link.download = filename;
        link.href = roundedCanvas.toDataURL('image/png', 1.0);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        showNotification('✅ Card downloaded successfully!', 'success');
        
      } catch (error) {
        console.error('Canvas processing error:', error);
        showNotification('❌ Error processing image. Please try again.', 'error');
      }
      
      // Reset button state
      button.innerHTML = originalText;
      button.disabled = false;
      
    }).catch(error => {
      console.error('html2canvas error:', error);
      showNotification('❌ Error generating image. Please check your inputs.', 'error');
      
      // Reset button state
      button.innerHTML = originalText;
      button.disabled = false;
    });
    
  } catch (error) {
    console.error('Generate image error:', error);
    showNotification('❌ Unexpected error. Please refresh and try again.', 'error');
    
    // Reset button state
    button.innerHTML = originalText;
    button.disabled = false;
  }
}

// Show notification to user
function showNotification(message, type) {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    animation: slideInRight 0.3s ease;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  // Add animation keyframes if not already present
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

// Local Storage Management
const storage = {
  save: (key, value) => {
    try {
      localStorage.setItem(`lyricsCard_${key}`, JSON.stringify(value));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  },
  
  load: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`lyricsCard_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Could not load from localStorage:', error);
      return defaultValue;
    }
  }
};

// Save user preferences
function saveUserPreferences() {
  const preferences = {
    textColor: elements.textColor.value,
    bgColor: elements.bgColor.value,
    imageWidth: elements.imageWidth.value,
    borderRadius: elements.borderRadius.value,
    song: elements.song.value,
    artist: elements.artist.value,
    coverUrl: elements.coverUrl.value,
    lyrics: elements.lyrics.value
  };
  
  storage.save('preferences', preferences);
}

// Load user preferences
function loadUserPreferences() {
  const preferences = storage.load('preferences', {});
  
  if (preferences.textColor) elements.textColor.value = preferences.textColor;
  if (preferences.bgColor) elements.bgColor.value = preferences.bgColor;
  if (preferences.imageWidth) elements.imageWidth.value = preferences.imageWidth;
  if (preferences.borderRadius) elements.borderRadius.value = preferences.borderRadius;
  if (preferences.song) elements.song.value = preferences.song;
  if (preferences.artist) elements.artist.value = preferences.artist;
  if (preferences.coverUrl) elements.coverUrl.value = preferences.coverUrl;
  if (preferences.lyrics) elements.lyrics.value = preferences.lyrics;
}

// Theme presets
const themes = {
  spotify: { text: '#ffffff', bg: '#191414' },
  dark: { text: '#ffffff', bg: '#282828' },
  light: { text: '#000000', bg: '#f8f9fa' },
  purple: { text: '#ffffff', bg: '#6f42c1' }
};

// Apply theme preset
function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  
  elements.textColor.value = theme.text;
  elements.bgColor.value = theme.bg;
  
  // Update active theme button
  document.querySelectorAll('.theme-preset').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-theme="${themeName}"]`)?.classList.add('active');
  
  updatePreview();
  saveUserPreferences();
}

// Auto-save preferences on change
const debouncedSavePreferences = debounce(saveUserPreferences, 1000);

// Copy to clipboard functionality
async function copyToClipboard() {
  try {
    const canvas = await generateCanvas();
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showNotification('📋 Card copied to clipboard!', 'success');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        showNotification('❌ Could not copy to clipboard', 'error');
      }
    });
  } catch (error) {
    console.error('Copy error:', error);
    showNotification('❌ Copy failed. Please try download instead.', 'error');
  }
}

// Share functionality
async function shareCard() {
  if (!navigator.share) {
    // Fallback for browsers without Web Share API
    const text = `Check out my lyrics card for "${elements.song.value || 'this song'}" by ${elements.artist.value || 'this artist'}! Created with Spotify Lyrics Card Maker: https://chinmayjha.tech/spotify-lyrics-card-maker`;
    
    try {
      await navigator.clipboard.writeText(text);
      showNotification('🔗 Share text copied to clipboard!', 'success');
    } catch (error) {
      showNotification('❌ Could not prepare share text', 'error');
    }
    return;
  }

  try {
    const canvas = await generateCanvas();
    canvas.toBlob(async (blob) => {
      const file = new File([blob], `${elements.song.value || 'song'}-lyrics-card.png`, { type: 'image/png' });
      
      try {
        await navigator.share({
          title: 'My Lyrics Card',
          text: `Check out my lyrics card for "${elements.song.value || 'this song'}" by ${elements.artist.value || 'this artist'}!`,
          files: [file]
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
          showNotification('❌ Share failed', 'error');
        }
      }
    });
  } catch (error) {
    console.error('Share preparation error:', error);
    showNotification('❌ Could not prepare share', 'error');
  }
}

// Generate canvas helper function
function generateCanvas() {
  return html2canvas(elements.preview, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: elements.bgColor.value,
    scale: 2,
    logging: false,
  });
}

// Initialize the preview on page load
document.addEventListener('DOMContentLoaded', () => {
  loadUserPreferences();
  updatePreview();
  
  // Add theme preset listeners
  document.querySelectorAll('.theme-preset').forEach(button => {
    button.addEventListener('click', () => {
      applyTheme(button.dataset.theme);
    });
  });
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }
    
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'd':
          event.preventDefault();
          generateImage();
          break;
        case 'c':
          event.preventDefault();
          copyToClipboard();
          break;
        case 's':
          event.preventDefault();
          shareCard();
          break;
      }
    }
  });
  
  // Add auto-save listeners
  [elements.song, elements.artist, elements.coverUrl, elements.lyrics, 
   elements.textColor, elements.bgColor, elements.imageWidth, elements.borderRadius]
   .forEach(element => {
     element.addEventListener('input', debouncedSavePreferences);
   });
});