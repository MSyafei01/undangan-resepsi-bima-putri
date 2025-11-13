// ===== WEDDING GALLERY SLIDER =====
class WeddingGallery {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.totalSlides = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 2000; // 2 seconds untuk portrait
        this.isAutoPlaying = true;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.swipeThreshold = 50;
        
        this.init();
    }

    // ===== INITIALIZATION =====
    init() {
        console.log('🖼️ Wedding Gallery Initialized');
        
        this.cacheElements();
        this.setupGallery();
        this.createNavigation();
        this.addEventListeners();
        this.startAutoPlay();
    }

    cacheElements() {
        this.galleryContainer = document.querySelector('.gallery-container');
        this.slider = document.querySelector('.gallery-slider');
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        
        console.log(`📸 Found ${this.totalSlides} slides`);
    }

    setupGallery() {
        if (this.totalSlides === 0) return;
        
        this.slides[0].classList.add('active');
        this.createDots();
    }

    // ===== NAVIGATION CREATION =====
    createNavigation() {
        const dotsContainer = document.querySelector('.gallery-dots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.index = i;
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        const prevBtn = document.querySelector('.nav-btn.prev');
        const nextBtn = document.querySelector('.nav-btn.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
    }

    createDots() {
        let dotsContainer = document.querySelector('.gallery-dots');
        if (!dotsContainer) {
            dotsContainer = document.createElement('div');
            dotsContainer.className = 'gallery-dots';
            document.querySelector('.gallery-nav')?.appendChild(dotsContainer);
        }
    }

    // ===== SLIDE NAVIGATION =====
    async goToSlide(index, direction = 'auto') {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        const slideDirection = direction === 'auto' 
            ? (index > this.currentSlide ? 'next' : 'prev')
            : direction;
        
        this.resetAutoPlay();
        
        const oldSlide = this.currentSlide;
        this.currentSlide = index;
        
        this.slides[oldSlide].classList.remove('active');
        this.slides[oldSlide].classList.add(slideDirection === 'next' ? 'prev' : 'next');
        
        this.slides[this.currentSlide].classList.add('active', slideDirection);
        
        await this.waitForTransition();
        
        this.slides[oldSlide].classList.remove('prev', 'next');
        this.slides[this.currentSlide].classList.remove('next', 'prev');
        
        this.updateDots();
        
        this.isAnimating = false;
        
        console.log(`🖼️ Navigated to slide ${this.currentSlide + 1}/${this.totalSlides}`);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex, 'next');
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex, 'prev');
    }

    waitForTransition() {
        return new Promise(resolve => {
            setTimeout(resolve, 600);
        });
    }

    // ===== AUTO-PLAY FUNCTIONALITY =====
    startAutoPlay() {
        if (!this.isAutoPlaying || this.totalSlides <= 1) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
        
        console.log('🔄 Auto-play started');
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            console.log('⏹️ Auto-play stopped');
        }
    }

    resetAutoPlay() {
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    // ===== TOUCH/GESTURE SUPPORT =====
    setupTouchEvents() {
        this.galleryContainer?.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.galleryContainer?.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > this.swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    // ===== FULLSCREEN FUNCTIONALITY =====
    openFullscreen(index = this.currentSlide) {
        this.stopAutoPlay();
        
        const fullscreenOverlay = document.createElement('div');
        fullscreenOverlay.className = 'gallery-fullscreen';
        fullscreenOverlay.innerHTML = `
            <div class="fullscreen-close" onclick="window.gallery.closeFullscreen()">×</div>
            <div class="fullscreen-counter">${index + 1} / ${this.totalSlides}</div>
            <div class="fullscreen-nav">
                <button class="nav-btn prev" onclick="window.gallery.fullscreenPrevious()">‹</button>
                <button class="nav-btn next" onclick="window.gallery.fullscreenNext()">›</button>
            </div>
            <img src="${this.slides[index].querySelector('img').src}" 
                alt="${this.slides[index].querySelector('img').alt}" 
                class="fullscreen-slide">
        `;
        
        document.body.appendChild(fullscreenOverlay);
        document.body.style.overflow = 'hidden';
        
        this.setupFullscreenKeyboard();
        
        console.log('🔍 Fullscreen mode opened');
    }

    closeFullscreen() {
        const fullscreenOverlay = document.querySelector('.gallery-fullscreen');
        if (fullscreenOverlay) {
            fullscreenOverlay.remove();
            document.body.style.overflow = '';
            
            if (this.isAutoPlaying) {
                this.startAutoPlay();
            }
            
            console.log('🔍 Fullscreen mode closed');
        }
    }

    fullscreenNext() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.updateFullscreenView(nextIndex);
    }

    fullscreenPrevious() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateFullscreenView(prevIndex);
    }

    updateFullscreenView(index) {
        const fullscreenImg = document.querySelector('.fullscreen-slide');
        const counter = document.querySelector('.fullscreen-counter');
        
        if (fullscreenImg && counter) {
            fullscreenImg.src = this.slides[index].querySelector('img').src;
            fullscreenImg.alt = this.slides[index].querySelector('img').alt;
            counter.textContent = `${index + 1} / ${this.totalSlides}`;
            this.currentSlide = index;
            this.updateDots();
        }
    }

    setupFullscreenKeyboard() {
        const keyHandler = (e) => {
            if (!document.querySelector('.gallery-fullscreen')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.fullscreenPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.fullscreenNext();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closeFullscreen();
                    break;
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        this.fullscreenKeyHandler = keyHandler;
    }

    // ===== DOT NAVIGATION =====
    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    // ===== EVENT LISTENERS =====
    addEventListeners() {
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => this.openFullscreen(index));
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (document.querySelector('.gallery-fullscreen')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoPlay();
            } else if (this.isAutoPlaying) {
                this.startAutoPlay();
            }
        });
        
        this.setupTouchEvents();
    }

    // ===== CLEANUP =====
    destroy() {
        this.stopAutoPlay();
        
        if (this.fullscreenKeyHandler) {
            document.removeEventListener('keydown', this.fullscreenKeyHandler);
        }
        
        console.log('🖼️ Gallery destroyed');
    }
}

// ===== INITIALIZE GALLERY =====
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new WeddingGallery();
});