// ===== LYRICS CARD MAKER JAVASCRIPT ===== //

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

// ===== INITIALIZATION ===== //

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  loadUserPreferences();
});

// Initialize the application
function initializeApp() {
  // Hide loading screen after page load
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }, 1000);

  // Initialize theme
  initializeTheme();
  
  // Update preview initially
  updatePreview();
  
  // Set up auto-save
  setupAutoSave();
}

// ===== CACHE DOM ELEMENTS ===== //

const elements = {
  // Preview elements
  previewSong: document.getElementById('preview-song'),
  previewArtist: document.getElementById('preview-artist'),
  previewLyrics: document.getElementById('preview-lyrics'),
  artistImage: document.getElementById('artist-image'),
  preview: document.getElementById('preview'),
  
  // Form elements
  song: document.getElementById('song'),
  artist: document.getElementById('artist'),
  coverUrl: document.getElementById('cover-url'),
  lyrics: document.getElementById('lyrics'),
  imageWidth: document.getElementById('image-width'),
  borderRadius: document.getElementById('border-radius'),
  textColor: document.getElementById('text-color'),
  bgColor: document.getElementById('bg-color'),
  
  // Value displays
  imageWidthValue: document.getElementById('image-width-value'),
  radiusValue: document.getElementById('radius-value'),
  
  // Theme elements
  themeButtons: document.querySelectorAll('.theme-btn'),
  themeToggle: document.getElementById('themeToggle'),
  
  // Modal elements
  developerModal: document.getElementById('developerModal'),
  developerOverlay: document.getElementById('developerOverlay'),
  developerInfoBtn: document.getElementById('developerInfoBtn'),
  closeDeveloperBtn: document.getElementById('closeDeveloperBtn'),
  helpBtn: document.getElementById('helpBtn'),
  helpModal: document.getElementById('helpModal')
};

// ===== PREVIEW UPDATE FUNCTIONS ===== //

// Optimized update function using cached elements
function updatePreview() {
  if (!elements.previewSong) return;
  
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
  }

  // Update dimensions
  if (elements.imageWidth) {
    const width = elements.imageWidth.value;
    elements.preview.style.width = `${width}px`;
    if (elements.imageWidthValue) {
      elements.imageWidthValue.textContent = width;
    }
  }

  if (elements.borderRadius) {
    const radius = elements.borderRadius.value;
    elements.preview.style.borderRadius = `${radius}px`;
    if (elements.radiusValue) {
      elements.radiusValue.textContent = radius;
    }
  }

  // Update colors
  if (elements.textColor) {
    const textColor = elements.textColor.value;
    elements.preview.style.color = textColor;
    elements.previewSong.style.color = textColor;
    elements.previewLyrics.style.color = textColor;
  }

  if (elements.bgColor) {
    const bgColor = elements.bgColor.value;
    elements.preview.style.background = bgColor;
  }
}

// Debounced update function
const debouncedUpdatePreview = debounce(updatePreview, 150);

// ===== THEME SYSTEM ===== //

// Theme configurations
const themes = {
  classic: {
  name: 'Classic LyricsCard',
    textColor: '#ffffff',
    bgColor: '#282828',
    gradient: 'linear-gradient(135deg, #1db954, #1ed760)'
  },
  midnight: {
    name: 'Midnight Blue',
    textColor: '#ffffff',
    bgColor: '#1e293b',
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)'
  },
  sunset: {
    name: 'Sunset Orange',
    textColor: '#ffffff',
    bgColor: '#7c2d12',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)'
  },
  purple: {
    name: 'Royal Purple',
    textColor: '#ffffff',
    bgColor: '#581c87',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
  },
  pink: {
    name: 'Hot Pink',
    textColor: '#ffffff',
    bgColor: '#831843',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)'
  }
};

// Initialize theme system
function initializeTheme() {
  // Set up theme toggle
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleSiteTheme);
  }
  
  // Set up theme buttons
  elements.themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      applyCardTheme(theme);
      
      // Update active state
      elements.themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Save preference
      localStorage.setItem('selectedCardTheme', theme);
    });
  });
}

// Apply card theme
function applyCardTheme(themeKey) {
  const theme = themes[themeKey];
  if (!theme || !elements.textColor || !elements.bgColor) return;
  
  // Update form controls
  elements.textColor.value = theme.textColor;
  elements.bgColor.value = theme.bgColor;
  
  // Apply to preview
  if (elements.preview) {
    elements.preview.style.background = theme.bgColor;
    elements.preview.style.color = theme.textColor;
    
    if (elements.previewSong) {
      elements.previewSong.style.color = theme.textColor;
    }
    if (elements.previewLyrics) {
      elements.previewLyrics.style.color = theme.textColor;
    }
  }
}

// Toggle site theme (dark/light)
function toggleSiteTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('siteTheme', newTheme);
  
  // Update theme icon
  if (elements.themeToggle) {
    const icon = elements.themeToggle.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }
  }
}

// ===== EXPORT FUNCTIONS ===== //

// Generate and download image
function generateImage() {
  if (!elements.preview) return;
  
  // Add loading state
  const btnText = document.querySelector('.btn-export.btn-primary span');
  const originalText = btnText?.textContent || 'Download PNG';
  if (btnText) btnText.textContent = 'Generating...';
  
  // Import html2canvas dynamically if not available
  if (typeof html2canvas === 'undefined') {
    console.error('html2canvas library not loaded');
    if (btnText) btnText.textContent = originalText;
    return;
  }
  
  const options = {
    backgroundColor: null,
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true,
    width: elements.preview.offsetWidth,
    height: elements.preview.offsetHeight
  };
  
  html2canvas(elements.preview, options)
    .then(canvas => {
      // Create download link
      const link = document.createElement('a');
      link.download = `lyrics-card-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success feedback
      showNotification('Card downloaded successfully! 🎉', 'success');
      
      // Reset button text
      if (btnText) btnText.textContent = originalText;
    })
    .catch(error => {
      console.error('Error generating image:', error);
      showNotification('Error generating image. Please try again.', 'error');
      if (btnText) btnText.textContent = originalText;
    });
}

// Copy to clipboard
function copyToClipboard() {
  if (!elements.preview || !html2canvas) return;
  
  const options = {
    backgroundColor: null,
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true
  };
  
  html2canvas(elements.preview, options)
    .then(canvas => {
      canvas.toBlob(blob => {
        if (navigator.clipboard && window.ClipboardItem) {
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item])
            .then(() => {
              showNotification('Card copied to clipboard! 📋', 'success');
            })
            .catch(() => {
              fallbackCopyMethod(canvas);
            });
        } else {
          fallbackCopyMethod(canvas);
        }
      });
    })
    .catch(error => {
      console.error('Error copying to clipboard:', error);
      showNotification('Error copying to clipboard.', 'error');
    });
}

// Fallback copy method
function fallbackCopyMethod(canvas) {
  const dataURL = canvas.toDataURL();
  const textArea = document.createElement('textarea');
  textArea.value = dataURL;
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    showNotification('Card data copied! Paste in image editor.', 'info');
  } catch (err) {
    showNotification('Copy failed. Please download instead.', 'warning');
  }
  
  document.body.removeChild(textArea);
}

// Share card
function shareCard() {
  if (!elements.preview || !html2canvas) return;
  
  const options = {
    backgroundColor: null,
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true
  };
  
  html2canvas(elements.preview, options)
    .then(canvas => {
      canvas.toBlob(blob => {
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], 'lyrics-card.png', { type: 'image/png' });
          const shareData = {
            title: 'My Lyrics Card',
            text: `Check out this lyrics card for "${elements.song.value || 'this song'}" by ${elements.artist.value || 'artist'}!`,
            files: [file]
          };
          
          if (navigator.canShare(shareData)) {
            navigator.share(shareData)
              .then(() => {
                showNotification('Card shared successfully! 🔗', 'success');
              })
              .catch(() => {
                fallbackShare();
              });
          } else {
            fallbackShare();
          }
        } else {
          fallbackShare();
        }
      });
    })
    .catch(error => {
      console.error('Error sharing:', error);
      showNotification('Error sharing card.', 'error');
    });
}

// Fallback share method
function fallbackShare() {
  const text = `Check out this lyrics card I made! Created with LyricsCard maker.`;
  const url = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: 'Lyrics Card',
      text: text,
      url: url
    }).catch(() => {
      copyTextToClipboard(`${text} ${url}`);
    });
  } else {
    copyTextToClipboard(`${text} ${url}`);
  }
}

// Copy text to clipboard
function copyTextToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showNotification('Share link copied to clipboard!', 'success');
      });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification('Share link copied to clipboard!', 'success');
  }
}

// ===== NOTIFICATION SYSTEM ===== //

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelectorAll('.notification');
  existing.forEach(n => n.remove());
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    color: var(--text-primary);
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Auto remove
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(notificationStyles);

// ===== MODAL SYSTEM ===== //

// Developer modal functions
function openDeveloperModal() {
  if (elements.developerModal && elements.developerOverlay) {
    elements.developerOverlay.hidden = false;
    elements.developerModal.hidden = false;
    document.body.style.overflow = 'hidden';
    
    // Focus management
    elements.developerModal.focus();
  }
}

function closeDeveloperModal() {
  if (elements.developerModal && elements.developerOverlay) {
    elements.developerOverlay.hidden = true;
    elements.developerModal.hidden = true;
    document.body.style.overflow = '';
  }
}

// Help modal functions
function openHelpModal() {
  if (elements.helpModal) {
    const modal = new bootstrap.Modal(elements.helpModal);
    modal.show();
  }
}

// ===== EVENT LISTENERS ===== //

function setupEventListeners() {
  // Form input listeners
  if (elements.song) elements.song.addEventListener('input', debouncedUpdatePreview);
  if (elements.artist) elements.artist.addEventListener('input', debouncedUpdatePreview);
  if (elements.coverUrl) elements.coverUrl.addEventListener('input', debouncedUpdatePreview);
  if (elements.lyrics) elements.lyrics.addEventListener('input', debouncedUpdatePreview);
  if (elements.imageWidth) elements.imageWidth.addEventListener('input', debouncedUpdatePreview);
  if (elements.borderRadius) elements.borderRadius.addEventListener('input', debouncedUpdatePreview);
  if (elements.textColor) elements.textColor.addEventListener('input', debouncedUpdatePreview);
  if (elements.bgColor) elements.bgColor.addEventListener('input', debouncedUpdatePreview);
  
  // Modal listeners
  if (elements.developerInfoBtn) {
    elements.developerInfoBtn.addEventListener('click', openDeveloperModal);
  }
  if (elements.closeDeveloperBtn) {
    elements.closeDeveloperBtn.addEventListener('click', closeDeveloperModal);
  }
  if (elements.developerOverlay) {
    elements.developerOverlay.addEventListener('click', closeDeveloperModal);
  }
  if (elements.helpBtn) {
    elements.helpBtn.addEventListener('click', openHelpModal);
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
  
  // Escape key for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDeveloperModal();
    }
  });
  
  // Prevent modal close on content click
  if (elements.developerModal) {
    elements.developerModal.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// ===== KEYBOARD SHORTCUTS ===== //

function handleKeyboardShortcuts(e) {
  // Only trigger if not typing in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }
  
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'd':
        e.preventDefault();
        generateImage();
        break;
      case 'c':
        e.preventDefault();
        copyToClipboard();
        break;
      case 's':
        e.preventDefault();
        shareCard();
        break;
    }
  }
}

// ===== LOCAL STORAGE ===== //

function setupAutoSave() {
  const inputs = [elements.song, elements.artist, elements.coverUrl, elements.lyrics];
  
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', debounce(() => {
        saveUserPreferences();
      }, 500));
    }
  });
}

function saveUserPreferences() {
  const preferences = {
    song: elements.song?.value || '',
    artist: elements.artist?.value || '',
    coverUrl: elements.coverUrl?.value || '',
    lyrics: elements.lyrics?.value || '',
    imageWidth: elements.imageWidth?.value || '400',
    borderRadius: elements.borderRadius?.value || '15',
    textColor: elements.textColor?.value || '#ffffff',
    bgColor: elements.bgColor?.value || '#282828',
    lastSaved: Date.now()
  };
  
  try {
    localStorage.setItem('lyricsCardPreferences', JSON.stringify(preferences));
  } catch (e) {
    console.warn('Could not save preferences to localStorage');
  }
}

function loadUserPreferences() {
  try {
    const saved = localStorage.getItem('lyricsCardPreferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      
      // Load form values
      if (elements.song && preferences.song) elements.song.value = preferences.song;
      if (elements.artist && preferences.artist) elements.artist.value = preferences.artist;
      if (elements.coverUrl && preferences.coverUrl) elements.coverUrl.value = preferences.coverUrl;
      if (elements.lyrics && preferences.lyrics) elements.lyrics.value = preferences.lyrics;
      if (elements.imageWidth && preferences.imageWidth) elements.imageWidth.value = preferences.imageWidth;
      if (elements.borderRadius && preferences.borderRadius) elements.borderRadius.value = preferences.borderRadius;
      if (elements.textColor && preferences.textColor) elements.textColor.value = preferences.textColor;
      if (elements.bgColor && preferences.bgColor) elements.bgColor.value = preferences.bgColor;
      
      // Update preview after loading
      setTimeout(updatePreview, 100);
    }
    
    // Load theme preference
    const siteTheme = localStorage.getItem('siteTheme');
    if (siteTheme) {
      document.documentElement.setAttribute('data-theme', siteTheme);
      if (elements.themeToggle) {
        const icon = elements.themeToggle.querySelector('.theme-icon');
        if (icon) {
          icon.textContent = siteTheme === 'light' ? '🌙' : '☀️';
        }
      }
    }
    
    // Load card theme preference
    const cardTheme = localStorage.getItem('selectedCardTheme');
    if (cardTheme) {
      const themeBtn = document.querySelector(`[data-theme="${cardTheme}"]`);
      if (themeBtn) {
        themeBtn.classList.add('active');
        applyCardTheme(cardTheme);
      }
    }
  } catch (e) {
    console.warn('Could not load preferences from localStorage');
  }
}

// ===== UTILITY FUNCTIONS ===== //

// Image preloader
function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Smooth scroll to element
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// ===== GLOBAL FUNCTIONS (for HTML onclick handlers) ===== //

// Make functions globally available
window.generateImage = generateImage;
window.copyToClipboard = copyToClipboard;
window.shareCard = shareCard;
window.debouncedUpdatePreview = debouncedUpdatePreview;

// Analytics (privacy-friendly)
function trackEvent(eventName, properties = {}) {
  // Only track if user hasn't opted out
  if (localStorage.getItem('analyticsOptOut') !== 'true') {
    console.log('Event:', eventName, properties);
    // Add your analytics code here
  }
}

// Performance monitoring
function measurePerformance() {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    console.log(`Page load time: ${loadTime}ms`);
  }
}

// Call performance measurement after load
window.addEventListener('load', measurePerformance);

// PWA Install prompt (if manifest is available)
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button or banner
  const installBtn = document.createElement('button');
  installBtn.textContent = '📱 Install App';
  installBtn.className = 'btn nav-btn';
  installBtn.style.marginLeft = 'var(--spacing-xs)';
  installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        installBtn.remove();
      });
    }
  });
  
  const navbar = document.querySelector('.navbar-nav');
  if (navbar) {
    navbar.appendChild(installBtn);
  }
});

console.log('🎵 LyricsCard - Modern Version Loaded! 🎵');