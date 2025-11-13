// ===== WEDDING INVITATION MAIN SCRIPT =====
class WeddingInvitation {
    constructor() {
        this.isMobile = this.checkMobile();
        this.init();
    }

    init() {
        console.log('🎉 Wedding Invitation Initialized!');
        console.log('📱 Mobile Device:', this.isMobile);
        
        this.initLoadingScreen();
        this.initCountdown();
        this.initScrollAnimations();
        this.initMagneticButtons();
        this.initRSVPForm();
        this.initPerformanceOptimizations();
        this.initErrorHandling();
        this.initMobileSpecificFeatures();
        this.addEventListeners();
    }

    // ===== MOBILE DETECTION =====
    checkMobile() {
        return window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // ===== MOBILE SPECIFIC FEATURES =====
    initMobileSpecificFeatures() {
        if (this.isMobile) {
            this.disableAnimationsForLowPerformance();
            this.optimizeTouchInteractions();
            this.adjustViewportForMobile();
        }
    }

    disableAnimationsForLowPerformance() {
        // Reduce animations for low-end devices
        if (this.isLowPerformanceDevice()) {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }
    }

    isLowPerformanceDevice() {
        // Simple heuristic for low performance devices
        return navigator.hardwareConcurrency <= 4 || 
               !('ontouchstart' in window) || // Very old devices
               window.innerWidth < 375; // Very small screens
    }

    optimizeTouchInteractions() {
        // Add touch-specific optimizations
        document.addEventListener('touchstart', function() {}, { passive: true });
        document.addEventListener('touchmove', function() {}, { passive: true });
        
        // Prevent double tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    adjustViewportForMobile() {
        // Adjust viewport for better mobile experience
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }

    // ===== COUNTDOWN TIMER =====
    initCountdown() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const weddingDate = new Date('December 7, 2025 00:00:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            this.handleWeddingDay();
            return;
        }

        const time = this.calculateTimeUnits(distance);
        this.displayCountdown(time);
    }

    calculateTimeUnits(distance) {
        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
    }

    displayCountdown(time) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        Object.keys(time).forEach(unit => {
            if (elements[unit]) {
                const currentValue = elements[unit].textContent;
                const newValue = time[unit].toString().padStart(2, '0');
                
                if (currentValue !== newValue) {
                    this.animateCountdownChange(elements[unit], newValue);
                }
            }
        });
    }

    animateCountdownChange(element, newValue) {
        element.classList.add('changing');
        element.textContent = newValue;
        
        // Only create particles on desktop for performance
        if (!this.isMobile) {
            this.createCountdownParticles(element);
        }
        
        setTimeout(() => {
            element.classList.remove('changing');
        }, 600);
    }

    handleWeddingDay() {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.innerHTML = `
                <div class="wedding-day-message">
                    <h3>🎉 Hari Bahagia Telah Tiba! 🎉</h3>
                    <p>Selamat datang di hari pernikahan Bima & Putri!</p>
                </div>
            `;
        }
    }

    createCountdownParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 3; i++) { // Reduced for performance
            this.createParticle(centerX, centerY);
        }
    }

    // ===== LOADING SCREEN =====
    initLoadingScreen() {
        // Show loading screen immediately
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                if (loadingScreen) {
                    loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        loadingScreen.remove();
                        this.onContentLoaded();
                    }, 800);
                }
            }, this.isMobile ? 1000 : 2000); // Shorter loading on mobile
        });

        // Fallback in case load event doesn't fire
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.remove();
                    this.onContentLoaded();
                }, 800);
            }
        }, 5000);
    }

    onContentLoaded() {
        console.log('✅ Content fully loaded');
        document.body.classList.add('loaded');
        
        // Initialize mobile-specific features after load
        if (this.isMobile) {
            this.finalizeMobileOptimizations();
        }
    }

    finalizeMobileOptimizations() {
        // Remove heavy elements on mobile
        this.reduceFloatingElements();
        this.optimizeImagesForMobile();
        this.adjustAnimationsForMobile();
    }

    reduceFloatingElements() {
        // Reduce number of floating elements on mobile
        const floatingContainers = document.querySelectorAll('.floating-hearts, .floating-sakura, .floating-sea, .floating-elements, .floating-confetti, .floating-rings');
        floatingContainers.forEach(container => {
            const elements = container.querySelectorAll('.heart, .sakura, .sea-element, .floating-element, .confetti, .ring-element');
            // Keep only 3 elements on mobile
            for (let i = 3; i < elements.length; i++) {
                elements[i].remove();
            }
        });
    }

    optimizeImagesForMobile() {
        // Lazy load images that aren't critical
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    adjustAnimationsForMobile() {
        // Reduce animation intensity on mobile
        if (this.isMobile) {
            document.documentElement.style.setProperty('--float-duration', '8s');
            document.documentElement.style.setProperty('--pulse-duration', '4s');
        }
    }

    // ===== MAGNETIC BUTTONS =====
    initMagneticButtons() {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        
        // Only enable magnetic effect on desktop
        if (!this.isMobile) {
            magneticBtns.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const moveX = (x - centerX) * 0.1;
                    const moveY = (y - centerY) * 0.1;
                    
                    btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translate(0, 0)';
                });
            });
        }
    }

    // ===== SCROLL ANIMATIONS =====
    initScrollAnimations() {
        // Use simpler intersection observer for mobile
        const options = this.isMobile ? {
            threshold: 0.1,
            rootMargin: '0px 0px -10px 0px'
        } : {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.handleEnhancedElementInView(entry.target);
                    }
                });
            },
            options
        );

        this.observeEnhancedElements();
    }

    observeEnhancedElements() {
        const elementsToObserve = [
            '.story-paragraph',
            '.events-content',
            '.vows-content',
            '.section-title',
            '.gallery-container',
            '.rsvp-form',
            '.gratitude-content',
            '.countdown-item',
            '.events-detail',
            '.vows-detail',
            '.profile-card',
            '.blessing-content'
        ];

        elementsToObserve.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.observer.observe(element);
            });
        });
    }

    handleEnhancedElementInView(element) {
        element.classList.add('animate-in');
        
        if (element.classList.contains('story-paragraph')) {
            element.classList.add('visible');
        }
        
        if (element.classList.contains('events-detail') || 
            element.classList.contains('vows-detail')) {
            this.animateStaggeredChildren(element.parentElement);
        }
    }

    animateStaggeredChildren(parent) {
        const children = Array.from(parent.children);
        const delay = this.isMobile ? 50 : 100; // Faster on mobile
        
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('stagger-item');
            }, index * delay);
        });
    }

    // ===== RSVP FORM =====
    initRSVPForm() {
        const form = document.getElementById('rsvpForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleRSVPSubmit(e));
            
            // Add touch improvements for form
            if (this.isMobile) {
                this.optimizeFormForTouch(form);
            }
            
            console.log('✅ RSVP form initialized');
        } else {
            console.error('❌ RSVP form not found');
        }
    }

    optimizeFormForTouch(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Add larger touch target
            input.style.minHeight = '44px';
            input.style.padding = '12px 16px';
            
            // Prevent zoom on focus
            input.addEventListener('touchstart', function() {
                this.style.fontSize = '16px';
            });
        });
    }

    async handleRSVPSubmit(e) {
        e.preventDefault();
        console.log('📝 RSVP form submitted');
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('📊 Form data:', data);
        
        if (!this.validateRSVPForm(data)) {
            console.log('❌ Form validation failed');
            return;
        }
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.1) {
                        resolve(data);
                    } else {
                        reject(new Error('Network error'));
                    }
                }, this.isMobile ? 1000 : 2000); // Faster on mobile
            });
            
            console.log('✅ RSVP submitted successfully');
            this.showNotification('🎉 Konfirmasi kehadiran berhasil dikirim! Terima kasih atas doa dan restunya.', 'success');
            form.reset();
            this.createRsvpSuccessEffect();
            
        } catch (error) {
            console.error('❌ RSVP submission failed:', error);
            this.showNotification('❌ Gagal mengirim konfirmasi. Silakan coba lagi dalam beberapa saat.', 'error');
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    }

    validateRSVPForm(data) {
        console.log('🔍 Validating form data...');
        
        if (!data.name || data.name.trim() === '') {
            this.showNotification('❌ Harap isi nama lengkap', 'error');
            return false;
        }
        
        if (!data.attendance) {
            this.showNotification('❌ Harap pilih konfirmasi kehadiran', 'error');
            return false;
        }
        
        if (data.attendance === 'hadir') {
            const guests = parseInt(data.guests) || 0;
            if (guests < 1 || guests > 6) {
                this.showNotification('❌ Jumlah tamu harus antara 1-6 orang', 'error');
                return false;
            }
        }
        
        console.log('✅ Form validation passed');
        return true;
    }

    createRsvpSuccessEffect() {
        const form = document.getElementById('rsvpForm');
        if (form) {
            form.classList.add('success-animation');
            setTimeout(() => {
                form.classList.remove('success-animation');
            }, 2000);
        }
        
        // Fewer effects on mobile
        const effectCount = this.isMobile ? 4 : 8;
        for (let i = 0; i < effectCount; i++) {
            setTimeout(() => this.createFloatingHeart(), i * 200);
        }
    }

    createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.cssText = `
            position: fixed;
            font-size: ${this.isMobile ? '1.2rem' : '1.5rem'};
            z-index: 10000;
            pointer-events: none;
            animation: floatUp 2s ease-in forwards;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
        `;
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2000);
    }

    // ===== NOTIFICATION SYSTEM =====
    showNotification(message, type = 'info') {
        console.log(`📢 Notification [${type}]: ${message}`);
        
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: '💝',
            warning: '⚠️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || '💝'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        const isMobile = this.isMobile;
        const position = isMobile ? 'top: 10px; left: 10px; right: 10px;' : 'top: 20px; right: 20px;';
        const maxWidth = isMobile ? 'calc(100vw - 20px)' : '400px';
        
        notification.style.cssText = `
            position: fixed;
            ${position}
            padding: ${isMobile ? '0.8rem 1rem' : '1rem 1.5rem'};
            border-radius: 12px;
            color: white;
            z-index: 10000;
            transform: ${isMobile ? 'translateY(-100px)' : 'translateX(400px)'};
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: ${maxWidth};
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            font-family: var(--font-secondary);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            font-size: ${isMobile ? 'var(--text-sm)' : 'var(--text-base)'};
        `;
        
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            info: 'linear-gradient(135deg, var(--accent-gold), var(--accent-blue))',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
        };
        
        notification.style.background = colors[type] || colors.info;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = isMobile ? 'translateY(0)' : 'translateX(0)';
        }, 100);
        
        const autoHideTime = isMobile ? 3000 : 5000;
        setTimeout(() => {
            notification.style.transform = isMobile ? 'translateY(-100px)' : 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, autoHideTime);
        
        notification.addEventListener('click', () => {
            notification.style.transform = isMobile ? 'translateY(-100px)' : 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // ===== ENHANCED PARTICLE SYSTEM =====
    createParticle(x, y) {
        // Skip particles on mobile for performance
        if (this.isMobile) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--accent-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            top: ${y}px;
            left: ${x}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        
        particle.style.animation = `particle-explosion 0.8s ease-out forwards`;
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }

    // ===== PERFORMANCE & ERROR HANDLING =====
    initPerformanceOptimizations() {
        // Use requestAnimationFrame for smooth animations
        this.rafId = null;
        
        // Debounce scroll events
        this.debouncedScroll = this.debounce(() => {
            this.handleScroll();
        }, 100);
        
        window.addEventListener('scroll', this.debouncedScroll);
    }

    debounce(func, wait) {
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

    handleScroll() {
        // Cancel existing animation frame
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        // Use requestAnimationFrame for smooth handling
        this.rafId = requestAnimationFrame(() => {
            // Scroll handling logic here
        });
    }

    initErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global Error:', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }

    // ===== EVENT LISTENERS =====
    addEventListeners() {
        // Handle resize events for responsive behavior
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 300);
        });
    }

    handleResize() {
        const newIsMobile = this.checkMobile();
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            console.log('🔄 Device type changed:', this.isMobile ? 'Mobile' : 'Desktop');
            this.finalizeMobileOptimizations();
        }
    }

    // ===== CLEANUP =====
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        window.removeEventListener('scroll', this.debouncedScroll);
        window.removeEventListener('resize', this.handleResize);
    }
}


// ===== INITIALIZE ENHANCED APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.weddingApp = new WeddingInvitation();
});


// ===== GLOBAL FUNCTIONS =====
function openWeddingInvitation() {
    console.log('🎀 Opening wedding invitation...');
    
    // Scroll to next section or open full invitation
    const firstSection = document.querySelector('.section.active');
    if (firstSection) {
        firstSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    
    // Play music if available
    const audio = document.getElementById('weddingMusic');
    const audioControl = document.getElementById('audioControl');
    
    if (audio && audioControl) {
        audio.play().catch(e => {
            console.log('Audio play failed:', e);
            // Show play button for user interaction
            audioControl.style.display = 'flex';
        });
    }
}


// Add CSS for new animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -100px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes particle-explosion {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }
    
    .wedding-day-message {
        text-align: center;
        padding: 2rem;
        background: rgba(255,255,255,0.1);
        border-radius: 15px;
        backdrop-filter: blur(10px);
    }
    
    .wedding-day-message h3 {
        color: var(--accent-gold);
        margin-bottom: 1rem;
    }
    
    /* Mobile specific improvements */
    @media (max-width: 768px) {
        .section {
            padding: 3rem 0 !important;
            min-height: auto !important;
        }
        
        .container {
            padding: 0 1rem !important;
        }
        
        /* Improve touch scrolling */
        body {
            -webkit-overflow-scrolling: touch;
        }
    }
`;
document.head.appendChild(style);