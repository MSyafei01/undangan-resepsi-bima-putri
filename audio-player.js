// ===== SIMPLE WEDDING AUDIO PLAYER =====
class SimpleAudioPlayer {
    constructor() {
        this.audio = document.getElementById('weddingMusic');
        this.audioControl = document.getElementById('audioControl');
        this.musicIcon = document.getElementById('musicIcon');
        this.isPlaying = false;
        this.userHasInteracted = false;
        
        console.log('🎵 Audio Player Initialized');
        
        this.init();
        this.checkAutoPlay();
    }

    init() {
        this.audio.volume = 0.7;
        
        this.audioControl.addEventListener('click', () => this.toggleMusic());
        
        this.audio.addEventListener('loadeddata', () => {
            console.log('✅ Audio loaded successfully');
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('❌ Audio error:', e);
            this.handleAudioError();
        });
        
        this.audio.addEventListener('play', () => {
            console.log('▶️ Audio playback started');
            this.isPlaying = true;
            this.musicIcon.textContent = '🔊';
        });
        
        this.audio.addEventListener('pause', () => {
            console.log('⏸️ Audio paused');
            this.isPlaying = false;
            this.musicIcon.textContent = '🔇';
        });
    }

    // Method untuk auto play dari localStorage
    checkAutoPlay() {
        const shouldAutoPlay = localStorage.getItem('music-autoplay') === 'true';
        const wasPlaying = localStorage.getItem('music-playing') === 'true';
        
        console.log('🔍 Checking auto-play flags:', { shouldAutoPlay, wasPlaying });
        
        if (shouldAutoPlay && wasPlaying) {
            console.log('🔊 Auto-playing music from previous session...');
            
            setTimeout(() => {
                this.userHasInteracted = true;
                this.playMusic();
                
                localStorage.removeItem('music-autoplay');
                localStorage.removeItem('music-playing');
                console.log('✅ Auto-play flags cleared');
            }, 1500);
        }
    }

    playMusic() {
        if (!this.audio) {
            console.error('❌ No audio element found');
            return;
        }
        
        console.log('🔊 Attempting to play audio...');
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('✅ Audio play successful');
                this.isPlaying = true;
                this.musicIcon.textContent = '🔊';
            }).catch(error => {
                console.error('❌ Audio play failed:', error);
                this.handlePlayError(error);
            });
        }
    }

    pauseMusic() {
        if (!this.audio) return;
        
        this.audio.pause();
        this.isPlaying = false;
        this.musicIcon.textContent = '🔇';
        console.log('⏸️ Music paused');
    }

    toggleMusic() {
        console.log('🎵 Toggle music clicked');
        if (!this.userHasInteracted) {
            this.userHasInteracted = true;
            this.playMusic();
        } else {
            if (this.isPlaying) {
                this.pauseMusic();
            } else {
                this.playMusic();
            }
        }
    }

    handleAudioError() {
        console.error('❌ Audio file not found or corrupted');
        this.musicIcon.textContent = '❌';
        this.audioControl.title = 'File musik tidak ditemukan';
        
        setTimeout(() => {
            alert('File musik tidak dapat dimuat. Pastikan file SaxophoneWedding.mp3 ada di folder assets/audio/');
        }, 1000);
    }

    handlePlayError(error) {
        console.error('Playback error:', error);
        
        if (error.name === 'NotAllowedError') {
            console.log('ℹ️ Autoplay blocked, need user interaction');
            this.musicIcon.textContent = '🔇';
            this.audioControl.title = 'Klik untuk memutar musik';
        }
    }
}

// ===== INITIALIZE AUDIO PLAYER =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔊 Initializing audio player...');
    window.audioPlayer = new SimpleAudioPlayer();
});

// ===== GLOBAL FUNCTIONS =====
function openWeddingInvitation() {
    console.log('🎊 Opening wedding invitation...');
    
    localStorage.setItem('music-autoplay', 'true');
    localStorage.setItem('music-playing', 'true');
    
    console.log('💾 Saved music flags to localStorage');
    
    if (window.audioPlayer) {
        console.log('✅ Audio player found, triggering play...');
        window.audioPlayer.userHasInteracted = true;
    }
    
    setTimeout(() => {
        console.log('🔄 Redirecting to undangan.html...');
        window.location.href = 'undangan.html';
    }, 500);
}

function toggleMusic() {
    if (window.audioPlayer) {
        window.audioPlayer.toggleMusic();
    }
}

// Export functions to global scope
window.openWeddingInvitation = openWeddingInvitation;
window.toggleMusic = toggleMusic;