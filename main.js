// Gallery Configuration
const GALLERY_CONFIG = {
    radius: 240,
    autoRotate: true,
    rotateSpeed: -60, // seconds for 360 degrees
    imgWidth: 120,
    imgHeight: 170
};



// DOM Elements
const odrag = document.getElementById('drag-container');
const ospin = document.getElementById('spin-container');
const ground = document.getElementById('ground');
const canvas = document.getElementById('canvas');
const confettiBtn = document.getElementById('confettiBtn');

// Gallery Elements
const galleryImages = [...ospin.getElementsByTagName('img')];

// Initialize Gallery
function initGallery() {
    // Set container sizes
    ospin.style.width = GALLERY_CONFIG.imgWidth + "px";
    ospin.style.height = GALLERY_CONFIG.imgHeight + "px";
    ground.style.width = GALLERY_CONFIG.radius * 3 + "px";
    ground.style.height = GALLERY_CONFIG.radius * 3 + "px";
    
    // Position images in 3D space
    setTimeout(init, 1000);
}

// Initialize canvas
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init(delayTime) {
    galleryImages.forEach((img, i) => {
        const angle = i * (360 / galleryImages.length);
        img.style.transform = `rotateY(${angle}deg) translateZ(${GALLERY_CONFIG.radius}px)`;
        img.style.transition = "transform 1s";
        img.style.transitionDelay = delayTime || (galleryImages.length - i) / 4 + "s";
    });
}

function applyTranform(obj) {
  // Constrain the angle of camera (between 0 and 180)
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;

  // Apply the angle while preserving fixed positioning
  obj.style.transform = "translate(-50%, -50%) rotateX(" + (-tY + -10) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}

var desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// Auto-rotate gallery
function startAutoRotation() {
    if (GALLERY_CONFIG.autoRotate) {
        const animationName = GALLERY_CONFIG.rotateSpeed > 0 ? 'spin' : 'spinRevert';
        ospin.style.animation = `${animationName} ${Math.abs(GALLERY_CONFIG.rotateSpeed)}s infinite linear`;
    }
}

// Spotify-style Music Player Setup
var audio = document.getElementById('myAudio');
var playPauseBtn = document.getElementById('playPauseBtn');
var progressBar = document.getElementById('progressBar');
var progressFill = document.getElementById('progressFill');
var currentTimeDisplay = document.getElementById('currentTime');
var durationDisplay = document.getElementById('duration');
var volumeBtn = document.getElementById('volumeBtn');
var volumeSlider = document.getElementById('volumeSlider');
var volumeFill = document.getElementById('volumeFill');
var prevBtn = document.getElementById('prevBtn');
var nextBtn = document.getElementById('nextBtn');

var isPlaying = false;
var currentVolume = 0.7;
var isMuted = false;
var playlist = ['music/setlove.mp3', 'music/setlove1.mp3'];
var currentTrackIndex = 0;

// Initialize audio
audio.volume = currentVolume;
volumeFill.style.width = (currentVolume * 100) + '%';

// Format time function
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}

// Play/Pause functionality
playPauseBtn.addEventListener('click', function() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.textContent = '▶';
        isPlaying = false;
    } else {
        audio.play().catch(function(e) {
            console.log('Audio playback failed:', e);
        });
        playPauseBtn.textContent = '⏸';
        isPlaying = true;
    }
});

// Audio event listeners
audio.addEventListener('loadedmetadata', function() {
    durationDisplay.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', function() {
    var progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = progress + '%';
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('ended', function() {
    nextTrack();
});

// Progress bar click
progressBar.addEventListener('click', function(e) {
    var rect = progressBar.getBoundingClientRect();
    var clickX = e.clientX - rect.left;
    var width = rect.width;
    var newTime = (clickX / width) * audio.duration;
    audio.currentTime = newTime;
});

// Volume controls
volumeBtn.addEventListener('click', function() {
    if (isMuted) {
        audio.volume = currentVolume;
        volumeFill.style.width = (currentVolume * 100) + '%';
        volumeBtn.textContent = currentVolume > 0.5 ? '🔊' : '🔉';
        isMuted = false;
    } else {
        audio.volume = 0;
        volumeFill.style.width = '0%';
        volumeBtn.textContent = '🔇';
        isMuted = true;
    }
});

volumeSlider.addEventListener('click', function(e) {
    var rect = volumeSlider.getBoundingClientRect();
    var clickX = e.clientX - rect.left;
    var width = rect.width;
    var newVolume = clickX / width;
    
    currentVolume = newVolume;
    audio.volume = newVolume;
    volumeFill.style.width = (newVolume * 100) + '%';
    
    if (newVolume > 0.5) {
        volumeBtn.textContent = '🔊';
    } else if (newVolume > 0) {
        volumeBtn.textContent = '🔉';
    } else {
        volumeBtn.textContent = '🔇';
    }
    isMuted = false;
});

// Previous/Next track functions
function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack();
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack();
}

function loadTrack() {
    audio.src = playlist[currentTrackIndex];
    if (isPlaying) {
        audio.play().catch(function(e) {
            console.log('Audio playback failed:', e);
        });
    }
}

prevBtn.addEventListener('click', previousTrack);
nextBtn.addEventListener('click', nextTrack);

// Auto-start music with user interaction
setTimeout(function() {
    document.addEventListener('click', function() {
        if (!isPlaying) {
            audio.play().then(function() {
                playPauseBtn.textContent = '⏸';
                isPlaying = true;
            }).catch(function(e) {
                console.log('Audio autoplay failed:', e);
            });
        }
    }, { once: true });
}, 1000);

// setup events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

// Zoom with mouse wheel
document.addEventListener('wheel', function(e) {
    const delta = e.deltaY > 0 ? -20 : 20;
    GALLERY_CONFIG.radius = Math.max(100, Math.min(400, GALLERY_CONFIG.radius + delta));
    init(0.1);
});

// Canvas Animation Effects
function initCanvasEffects() {
    const ctx = canvas.getContext('2d');
    const fireworks = [];
    const hearts = [];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Firework {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = random(2, 4);
            this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
            this.vx = random(-3, 3);
            this.vy = random(-3, 3);
            this.life = 100;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
        }
    }

    class Heart {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = random(20, 40);
            this.color = '#ff69b4';
            this.vy = random(-2, -1);
            this.opacity = 1;
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x - this.size / 2, this.y - this.size / 2, this.x - this.size, this.y + this.size / 3, this.x, this.y + this.size);
            ctx.bezierCurveTo(this.x + this.size, this.y + this.size / 3, this.x + this.size / 2, this.y - this.size / 2, this.x, this.y);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        update() {
            this.y += this.vy;
            this.opacity -= 0.01;
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add new effects occasionally
        if (Math.random() < 0.08) {
            fireworks.push(new Firework(random(0, canvas.width), random(0, canvas.height)));
        }
        if (Math.random() < 0.04) {
            hearts.push(new Heart(random(0, canvas.width), canvas.height));
        }

        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const firework = fireworks[i];
            firework.draw();
            firework.update();
            if (firework.life <= 0) {
                fireworks.splice(i, 1);
            }
        }

        // Update and draw hearts
        for (let i = hearts.length - 1; i >= 0; i--) {
            const heart = hearts[i];
            heart.draw();
            heart.update();
            if (heart.opacity <= 0) {
                hearts.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// Confetti button functionality
if (confettiBtn) {
    confettiBtn.addEventListener('click', function() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    });
}

// Initialize everything when DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    initGallery();
    startAutoRotation();
    initCanvasEffects();
});