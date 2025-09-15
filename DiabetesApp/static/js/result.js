// Result page interactions and animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page animations
    initializeAnimations();
    
    // Setup interactive elements
    setupInteractiveElements();
    
    // Animate risk bar
    animateRiskBar();
    
    // Setup print functionality
    setupPrintFunctionality();
});

function initializeAnimations() {
    // Animate result cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all result cards
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        cardObserver.observe(card);
    });

    // Animate recommendation items
    const recommendationItems = document.querySelectorAll('.recommendation-item');
    recommendationItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1 + 0.5}s, transform 0.5s ease ${index * 0.1 + 0.5}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, (index * 100) + 500);
    });

    // Animate factors grid
    const factors = document.querySelectorAll('.factor');
    factors.forEach((factor, index) => {
        factor.style.opacity = '0';
        factor.style.transform = 'scale(0.8)';
        factor.style.transition = `opacity 0.4s ease ${index * 0.05 + 1}s, transform 0.4s ease ${index * 0.05 + 1}s`;
        
        setTimeout(() => {
            factor.style.opacity = '1';
            factor.style.transform = 'scale(1)';
        }, (index * 50) + 1000);
    });
}

function setupInteractiveElements() {
    // Add hover effects to recommendation items
    const recommendationItems = document.querySelectorAll('.recommendation-item');
    recommendationItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
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
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function animateRiskBar() {
    const riskFill = document.querySelector('.risk-fill');
    if (riskFill) {
        const targetWidth = riskFill.style.width;
        riskFill.style.width = '0%';
        
        setTimeout(() => {
            riskFill.style.width = targetWidth;
            
            // Add pulsing effect for high risk
            if (riskFill.classList.contains('high-risk')) {
                riskFill.style.animation = 'pulse 2s infinite';
            }
        }, 1000);
    }
}

function setupPrintFunctionality() {
    const printButtons = document.querySelectorAll('.print-btn');
    let isPrinting = false; // Prevent double print dialogs
    
    printButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Prevent multiple print dialogs
            if (isPrinting) {
                return;
            }
            
            isPrinting = true;
            
            // Create compact print header inside results container
            const printHeader = document.createElement('div');
            printHeader.className = 'print-header print-only';
            printHeader.innerHTML = `
                <h1>DiabetesGuard Health Report</h1>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
            `;
            
            // Insert header at the beginning of results container only
            const resultsContainer = document.querySelector('.results-container .container');
            if (resultsContainer) {
                resultsContainer.insertBefore(printHeader, resultsContainer.firstChild);
            }
            
            // Add no-print class to non-essential elements
            const elementsToHide = document.querySelectorAll('.navbar, .footer, .footer-actions, .btn-primary, .btn-secondary, .share-btn, .recommendations-card, .next-steps-card, .disclaimer-card, .result-actions');
            elementsToHide.forEach(el => el.classList.add('no-print'));
            
            // Trigger print with delay to ensure styles are applied
            setTimeout(() => {
                window.print();
                
                // Clean up after print dialog closes
                setTimeout(() => {
                    if (printHeader && printHeader.parentNode) {
                        printHeader.remove();
                    }
                    elementsToHide.forEach(el => el.classList.remove('no-print'));
                    isPrinting = false;
                }, 1000);
            }, 100);
        });
    });
}

// Share functionality
function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'DiabetesGuard - AI-Powered Diabetes Detection',
            text: 'Check your diabetes risk with our AI-powered health assessment tool.',
            url: window.location.origin
        }).catch(console.error);
    } else {
        // Fallback to clipboard
        const shareText = `Check your diabetes risk with DiabetesGuard - AI-powered health assessment: ${window.location.origin}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                fallbackCopyToClipboard(shareText);
            });
        } else {
            fallbackCopyToClipboard(shareText);
        }
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Link copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Could not copy link', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    };
    
    if (type === 'success') {
        styles.background = '#10b981';
    } else if (type === 'error') {
        styles.background = '#ef4444';
    } else {
        styles.background = '#3b82f6';
    }
    
    Object.assign(notification.style, styles);
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }
    
    .recommendation-item {
        transition: all 0.3s ease !important;
    }
    
    .recommendation-item:hover {
        transform: translateX(10px) scale(1.02) !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
    }
    
    .factor:hover {
        transform: scale(1.05) !important;
        background: var(--bg-tertiary) !important;
    }
    
    .result-card:hover .card-header {
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px !important;
            left: 10px !important;
            transform: translateY(-100px) !important;
        }
        
        .notification.show {
            transform: translateY(0) !important;
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        const printBtn = document.querySelector('[onclick*="print"]');
        if (printBtn) {
            printBtn.click();
        }
    }
    
    // Ctrl/Cmd + S for share
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        shareResults();
    }
    
    // N for new assessment
    if (e.key === 'n' || e.key === 'N') {
        const newAssessmentBtn = document.querySelector('a[href*="predict"]');
        if (newAssessmentBtn && !e.ctrlKey && !e.metaKey) {
            window.location.href = newAssessmentBtn.href;
        }
    }
    
    // H for home
    if (e.key === 'h' || e.key === 'H') {
        const homeBtn = document.querySelector('a[href*="home"], a[href="/"]');
        if (homeBtn && !e.ctrlKey && !e.metaKey) {
            window.location.href = homeBtn.href;
        }
    }
});

// Add loading states for navigation
document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.href.includes(window.location.origin)) {
            this.style.opacity = '0.7';
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }
    });
});

// Smooth reveal animations for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.disclaimer-card, .footer-actions');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.style.opacity = '1';
            reveal.style.transform = 'translateY(0)';
        }
    });
}

// Initialize reveal animations
const reveals = document.querySelectorAll('.disclaimer-card, .footer-actions');
reveals.forEach(reveal => {
    reveal.style.opacity = '0';
    reveal.style.transform = 'translateY(30px)';
    reveal.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Check on load

// Add accessibility improvements
document.querySelectorAll('.result-card').forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `Result card ${index + 1}`);
});

// Focus management for keyboard users
let focusedCardIndex = -1;
const resultCards = document.querySelectorAll('.result-card');

document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' && e.shiftKey) {
        // Handle reverse tab navigation
        return;
    } else if (e.key === 'Tab') {
        // Handle forward tab navigation
        return;
    }
    
    // Arrow key navigation for result cards
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        if (e.key === 'ArrowDown') {
            focusedCardIndex = Math.min(focusedCardIndex + 1, resultCards.length - 1);
        } else {
            focusedCardIndex = Math.max(focusedCardIndex - 1, 0);
        }
        
        if (resultCards[focusedCardIndex]) {
            resultCards[focusedCardIndex].focus();
            resultCards[focusedCardIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
});
