/**
 * Comprehensive UI/UX Enhancement System
 * Modern design improvements with smooth animations and better visual hierarchy
 */

class UIUXEnhancer {
    constructor() {
        this.theme = {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#06b6d4',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            dark: '#0f172a',
            darkSecondary: '#1e293b',
            darkTertiary: '#334155'
        };
        this.init();
    }

    init() {
        this.enhanceSidebar();
        this.enhanceCards();
        this.addMicroInteractions();
        this.improveTypography();
        this.enhanceButtons();
        this.addLoadingStates();
        this.enhanceModals();
        this.addTooltips();
        this.improveSpacing();
        this.addGlowEffects();
        console.log('[UI/UX] Enhanced interface loaded');
    }

    enhanceSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        // Modern gradient background
        sidebar.style.background = `linear-gradient(145deg, ${this.theme.dark} 0%, ${this.theme.darkSecondary} 50%, ${this.theme.darkTertiary} 100%)`;
        sidebar.style.borderRight = `2px solid ${this.theme.primary}40`;
        sidebar.style.boxShadow = '4px 0 30px rgba(0, 0, 0, 0.5)';
        sidebar.style.backdropFilter = 'blur(20px)';

        // Add animated border
        const borderElement = document.createElement('div');
        borderElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, ${this.theme.primary}, ${this.theme.secondary}, ${this.theme.accent});
            animation: pulse 3s ease-in-out infinite;
        `;
        sidebar.appendChild(borderElement);

        // Enhance sidebar items
        const sidebarItems = sidebar.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.borderRadius = '8px';
            item.style.margin = '4px 8px';
            
            item.addEventListener('mouseenter', () => {
                item.style.background = `${this.theme.primary}20`;
                item.style.transform = 'translateX(4px)';
                item.style.boxShadow = `0 4px 12px ${this.theme.primary}30`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
                item.style.transform = 'translateX(0)';
                item.style.boxShadow = 'none';
            });
        });
    }

    enhanceCards() {
        const cards = document.querySelectorAll('.card, .module-card, .stats-card');
        cards.forEach(card => {
            card.style.cssText += `
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                backdrop-filter: blur(20px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            `;

            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px) scale(1.02)';
                card.style.boxShadow = `0 16px 48px rgba(59, 130, 246, 0.2)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            });

            // Add shimmer effect
            const shimmer = document.createElement('div');
            shimmer.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                animation: shimmer 3s ease-in-out infinite;
                pointer-events: none;
            `;
            card.appendChild(shimmer);
        });
    }

    addMicroInteractions() {
        // Button ripple effects
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation
        this.addCSS(`
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `);
    }

    improveTypography() {
        // Enhanced typography scale
        this.addCSS(`
            .enhanced-typography h1 {
                font-size: 3rem;
                font-weight: 800;
                line-height: 1.1;
                letter-spacing: -0.025em;
                background: linear-gradient(135deg, ${this.theme.primary}, ${this.theme.secondary});
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .enhanced-typography h2 {
                font-size: 2.25rem;
                font-weight: 700;
                line-height: 1.2;
                letter-spacing: -0.025em;
                color: #ffffff;
            }
            
            .enhanced-typography h3 {
                font-size: 1.875rem;
                font-weight: 600;
                line-height: 1.3;
                color: #e2e8f0;
            }
            
            .enhanced-typography p {
                font-size: 1.125rem;
                line-height: 1.6;
                color: #cbd5e1;
            }
        `);

        document.body.classList.add('enhanced-typography');
    }

    enhanceButtons() {
        this.addCSS(`
            .enhanced-btn {
                position: relative;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: none;
                cursor: pointer;
                overflow: hidden;
                background: linear-gradient(135deg, ${this.theme.primary}, ${this.theme.secondary});
                color: white;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            }
            
            .enhanced-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
            }
            
            .enhanced-btn:active {
                transform: translateY(0);
            }
            
            .enhanced-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
            }
            
            .enhanced-btn:hover::before {
                left: 100%;
            }
        `);

        // Apply enhanced styling to existing buttons
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(btn => {
            if (!btn.classList.contains('enhanced-btn')) {
                btn.classList.add('enhanced-btn');
            }
        });
    }

    addLoadingStates() {
        this.addCSS(`
            .loading-skeleton {
                background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 4px;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            .loading-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #334155;
                border-top: 2px solid ${this.theme.primary};
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `);
    }

    enhanceModals() {
        this.addCSS(`
            .enhanced-modal {
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                animation: modalSlideIn 0.3s ease-out;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `);
    }

    addTooltips() {
        const elementsWithTooltips = document.querySelectorAll('[title]');
        elementsWithTooltips.forEach(element => {
            const title = element.getAttribute('title');
            element.removeAttribute('title');
            
            const tooltip = document.createElement('div');
            tooltip.className = 'enhanced-tooltip';
            tooltip.textContent = title;
            tooltip.style.cssText = `
                position: absolute;
                background: ${this.theme.dark};
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s;
                border: 1px solid ${this.theme.primary}40;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;
            
            document.body.appendChild(tooltip);
            
            element.addEventListener('mouseenter', (e) => {
                const rect = element.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
                tooltip.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
        });
    }

    improveSpacing() {
        this.addCSS(`
            .enhanced-spacing {
                --space-xs: 0.25rem;
                --space-sm: 0.5rem;
                --space-md: 1rem;
                --space-lg: 1.5rem;
                --space-xl: 2rem;
                --space-2xl: 3rem;
            }
            
            .p-xs { padding: var(--space-xs); }
            .p-sm { padding: var(--space-sm); }
            .p-md { padding: var(--space-md); }
            .p-lg { padding: var(--space-lg); }
            .p-xl { padding: var(--space-xl); }
            .p-2xl { padding: var(--space-2xl); }
            
            .m-xs { margin: var(--space-xs); }
            .m-sm { margin: var(--space-sm); }
            .m-md { margin: var(--space-md); }
            .m-lg { margin: var(--space-lg); }
            .m-xl { margin: var(--space-xl); }
            .m-2xl { margin: var(--space-2xl); }
        `);
        
        document.body.classList.add('enhanced-spacing');
    }

    addGlowEffects() {
        this.addCSS(`
            .glow-primary {
                box-shadow: 0 0 20px ${this.theme.primary}40;
            }
            
            .glow-success {
                box-shadow: 0 0 20px ${this.theme.success}40;
            }
            
            .glow-warning {
                box-shadow: 0 0 20px ${this.theme.warning}40;
            }
            
            .glow-error {
                box-shadow: 0 0 20px ${this.theme.error}40;
            }
            
            .pulse-glow {
                animation: pulseGlow 2s ease-in-out infinite;
            }
            
            @keyframes pulseGlow {
                0%, 100% {
                    box-shadow: 0 0 20px ${this.theme.primary}40;
                }
                50% {
                    box-shadow: 0 0 30px ${this.theme.primary}60;
                }
            }
        `);
    }

    addCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Enhanced form styling
    enhanceForms() {
        this.addCSS(`
            .enhanced-input {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 12px 16px;
                color: white;
                font-size: 14px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .enhanced-input:focus {
                outline: none;
                border-color: ${this.theme.primary};
                box-shadow: 0 0 0 3px ${this.theme.primary}20;
                background: rgba(255, 255, 255, 0.08);
            }
            
            .enhanced-input::placeholder {
                color: #94a3b8;
            }
        `);

        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.classList.add('enhanced-input');
        });
    }

    // Add scroll animations
    addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
}

// Initialize enhanced UI/UX
document.addEventListener('DOMContentLoaded', () => {
    new UIUXEnhancer();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIUXEnhancer;
}