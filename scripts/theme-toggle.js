    // ===== WEDDING THEME TOGGLE SYSTEM =====
    // Author: Wedding Invitation System
    // Version: 1.0.0

    class ThemeToggle {
        constructor() {
            this.currentTheme = 'light';
            this.isTransitioning = false;
            this.animationDuration = 600;
            this.systemPreference = null;
            
            this.init();
        }

        // ===== INITIALIZATION =====
        init() {
            console.log('🎨 Theme Toggle System Initialized');
            
            this.detectSystemPreference();
            this.loadSavedTheme();
            this.setupThemeObserver();
            this.addEventListeners();
            this.applyInitialTheme();
            
            console.log(`🌓 Initial theme: ${this.currentTheme}`);
        }

        // ===== SYSTEM PREFERENCE DETECTION =====
        detectSystemPreference() {
            if (window.matchMedia) {
                this.systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                
                // Listen for system theme changes
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    this.systemPreference = e.matches ? 'dark' : 'light';
                    console.log(`🖥️ System preference changed to: ${this.systemPreference}`);
                    
                    // Only apply system theme if no user preference is saved
                    if (!localStorage.getItem('wedding-theme')) {
                        this.applyTheme(this.systemPreference, true);
                    }
                });
            }
        }

        // ===== THEME MANAGEMENT =====
        loadSavedTheme() {
            const savedTheme = localStorage.getItem('wedding-theme');
            
            if (savedTheme) {
                this.currentTheme = savedTheme;
            } else {
                // Use system preference if no saved theme
                this.currentTheme = this.systemPreference || 'light';
            }
        }

        applyInitialTheme() {
            // Apply theme without animation on initial load
            this.applyTheme(this.currentTheme, false);
        }

// Di method applyTheme(), tambahkan force update
    applyTheme(theme, animate = true) {
        if (this.isTransitioning || theme === this.currentTheme) return;
        
        const previousTheme = this.currentTheme;
        this.currentTheme = theme;
        
        console.log(`🎨 Applying theme to ALL elements: ${theme}`);
        
        // Force apply to entire document
        document.documentElement.setAttribute('data-theme', theme);
        
        if (animate) {
            this.animateThemeTransition(previousTheme, theme);
        } else {
            this.setThemeAttributes(theme);
        }
        
        // Extra insurance: manually trigger style recalculation
        this.forceStyleRecalculation();
        
        this.saveThemePreference(theme);
        this.updateToggleButton();
        this.dispatchThemeChangeEvent();
    }

    // Tambahkan method untuk force style recalculation
    forceStyleRecalculation() {
        // Trigger browser to recalculate styles
        document.body.style.animation = 'none';
        document.body.offsetHeight; /* trigger reflow */
        document.body.style.animation = null;
        
        // Force all sections to update
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.animation = 'none';
            section.offsetHeight;
            section.style.animation = null;
        });
    }

        setThemeAttributes(theme) {
            const body = document.body;
            
            if (theme === 'dark') {
                body.setAttribute('data-theme', 'dark');
            } else {
                body.removeAttribute('data-theme');
            }
            
            // Update meta theme-color for mobile browsers
            this.updateMetaThemeColor(theme);
        }

        animateThemeTransition(oldTheme, newTheme) {
            this.isTransitioning = true;
            
            // Add transitioning class for smooth color changes
            document.body.classList.add('theme-transitioning');
            
            // Set new theme attributes
            this.setThemeAttributes(newTheme);
            
            // Create theme transition overlay for smooth effect
            this.createTransitionOverlay(oldTheme, newTheme);
            
            // Remove transitioning class after animation
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
                this.isTransitioning = false;
            }, this.animationDuration);
        }

        createTransitionOverlay(oldTheme, newTheme) {
            // Remove existing overlay if any
            this.removeTransitionOverlay();
            
            // Create overlay element
            const overlay = document.createElement('div');
            overlay.className = 'theme-transition-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: ${newTheme === 'dark' ? '#0f172a' : '#ffffff'};
                opacity: 0;
                z-index: 9999;
                pointer-events: none;
                transition: opacity ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
            `;
            
            document.body.appendChild(overlay);
            this.transitionOverlay = overlay;
            
            // Trigger animation
            requestAnimationFrame(() => {
                overlay.style.opacity = '0.8';
                
                // Remove overlay after animation
                setTimeout(() => {
                    this.removeTransitionOverlay();
                }, this.animationDuration);
            });
        }

        removeTransitionOverlay() {
            if (this.transitionOverlay && this.transitionOverlay.parentNode) {
                this.transitionOverlay.parentNode.removeChild(this.transitionOverlay);
                this.transitionOverlay = null;
            }
        }

        // ===== META THEME COLOR UPDATES =====
        updateMetaThemeColor(theme) {
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            
            const colors = {
                light: '#ffffff',
                dark: '#0f172a'
            };
            
            metaThemeColor.content = colors[theme] || colors.light;
        }

        // ===== PREFERENCE SAVING =====
        saveThemePreference(theme) {
            try {
                localStorage.setItem('wedding-theme', theme);
                console.log('💾 Theme preference saved to localStorage');
            } catch (error) {
                console.warn('❌ Could not save theme preference:', error);
            }
        }

        clearThemePreference() {
            try {
                localStorage.removeItem('wedding-theme');
                this.currentTheme = this.systemPreference || 'light';
                this.applyTheme(this.currentTheme, true);
                console.log('🗑️ Theme preference cleared');
            } catch (error) {
                console.warn('❌ Could not clear theme preference:', error);
            }
        }

        // ===== TOGGLE BUTTON MANAGEMENT =====
        updateToggleButton() {
            const toggleBtn = document.querySelector('.theme-toggle');
            if (!toggleBtn) return;
            
            const icons = {
                light: '🌙',
                dark: '☀️'
            };
            
            toggleBtn.innerHTML = icons[this.currentTheme] || icons.light;
            toggleBtn.setAttribute('aria-label', `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`);
            
            // Add animation to button
            this.animateToggleButton(toggleBtn);
        }

        animateToggleButton(button) {
            button.style.transform = 'scale(1.1) rotate(180deg)';
            
            setTimeout(() => {
                button.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }

        // ===== EVENT SYSTEM =====
        dispatchThemeChangeEvent() {
            const event = new CustomEvent('themeChanged', {
                detail: {
                    theme: this.currentTheme,
                    previousTheme: this.previousTheme,
                    timestamp: Date.now()
                }
            });
            
            document.dispatchEvent(event);
        }

        setupThemeObserver() {
            // Listen for theme changes from other components
            document.addEventListener('themeChanged', (e) => {
                console.log('🎨 Theme change detected:', e.detail);
            });
        }

        // ===== EVENT LISTENERS =====
        addEventListeners() {
            // Theme toggle button
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggle());
                
                // Add keyboard support
                toggleBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle();
                    }
                });
                
                // Add tooltip
                this.addTooltip(toggleBtn);
            }
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                // Ctrl/Cmd + T to toggle theme
                if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                    e.preventDefault();
                    this.toggle();
                }
                
                // Ctrl/Cmd + L for light theme
                if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                    e.preventDefault();
                    this.applyTheme('light', true);
                }
                
                // Ctrl/Cmd + D for dark theme
                if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                    e.preventDefault();
                    this.applyTheme('dark', true);
                }
            });
            
            // Page visibility changes
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    // Re-apply theme when page becomes visible (fix for some browsers)
                    this.applyTheme(this.currentTheme, false);
                }
            });
        }

        addTooltip(element) {
            // Remove existing tooltip
            const existingTooltip = element.querySelector('.theme-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'theme-tooltip';
            tooltip.textContent = `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`;
            tooltip.style.cssText = `
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--text-primary);
                color: var(--bg-primary);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                z-index: 10001;
            `;
            
            element.style.position = 'relative';
            element.appendChild(tooltip);
            
            // Show/hide tooltip on hover
            element.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
        }

        // ===== PUBLIC METHODS =====
        toggle() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme, true);
            
            // Add haptic feedback if available
            this.provideHapticFeedback();
        }

        setLightTheme() {
            this.applyTheme('light', true);
        }

        setDarkTheme() {
            this.applyTheme('dark', true);
        }

        setSystemTheme() {
            this.clearThemePreference();
        }

        getThemeInfo() {
            return {
                current: this.currentTheme,
                systemPreference: this.systemPreference,
                isTransitioning: this.isTransitioning,
                hasUserPreference: !!localStorage.getItem('wedding-theme')
            };
        }

        // ===== HAPTIC FEEDBACK =====
        provideHapticFeedback() {
            if (navigator.vibrate) {
                navigator.vibrate(50); // 50ms vibration on supported devices
            }
        }

        // ===== ACCESSIBILITY FEATURES =====
        enhanceAccessibility() {
            // Add ARIA attributes
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.setAttribute('role', 'button');
                toggleBtn.setAttribute('aria-pressed', this.currentTheme === 'dark');
                toggleBtn.setAttribute('tabindex', '0');
            }
            
            // Add focus styles
            this.addFocusStyles();
        }

        addFocusStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .theme-toggle:focus {
                    outline: 2px solid var(--accent-gold);
                    outline-offset: 2px;
                }
                
                .theme-toggle:focus:not(:focus-visible) {
                    outline: none;
                }
            `;
            document.head.appendChild(style);
        }

        // ===== PERFORMANCE OPTIMIZATIONS =====
        optimizePerformance() {
            // Use passive event listeners where possible
            this.addPassiveEventListeners();
            
            // Debounce rapid theme toggles
            this.debounceToggle();
        }

        addPassiveEventListeners() {
            // Add passive event listeners for better scrolling performance
            const options = { passive: true };
            
            window.addEventListener('scroll', () => {}, options);
            // Add other passive listeners as needed
        }

        debounceToggle() {
            const originalToggle = this.toggle.bind(this);
            let lastToggleTime = 0;
            const toggleDelay = 500;
            
            this.toggle = () => {
                const now = Date.now();
                if (now - lastToggleTime > toggleDelay) {
                    lastToggleTime = now;
                    originalToggle();
                }
            };
        }

        // ===== ERROR HANDLING =====
        handleThemeError(error) {
            console.error('🎨 Theme application error:', error);
            
            // Fallback to light theme
            this.applyTheme('light', false);
            
            // Show error notification
            this.showErrorNotification('Theme error occurred. Using light theme as fallback.');
        }

        showErrorNotification(message) {
            // Use existing notification system or create simple one
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                z-index: 10000;
                max-width: 300px;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 5000);
        }

        // ===== CLEANUP =====
        destroy() {
            // Remove event listeners
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.replaceWith(toggleBtn.cloneNode(true));
            }
            
            // Remove transition overlay
            this.removeTransitionOverlay();
            
            console.log('🎨 Theme toggle system destroyed');
        }
    }

    // ===== INITIALIZE THEME TOGGLE =====
    document.addEventListener('DOMContentLoaded', () => {
        window.themeToggle = new ThemeToggle();
        
        // Enhance accessibility after initialization
        setTimeout(() => {
            window.themeToggle.enhanceAccessibility();
            window.themeToggle.optimizePerformance();
        }, 100);
    });

