// ============================================
// FURA TUDO - SCRIPT PRINCIPAL
// ============================================

// Navegação Mobile - Menu Hambúrguer
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const body = document.body;

// Toggle do menu hambúrguer
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevenir scroll quando menu está aberto
    if (navMenu.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
    
    // Animação do hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
        
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
        
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Prevenir propagação de cliques dentro do menu
navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// ============================================
// HEADER - Efeito de Scroll
// ============================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
        header.style.boxShadow = '0 5px 20px rgba(230, 30, 30, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLL - Links Internos
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// ANIMAÇÃO DE ELEMENTOS AO SCROLL
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animação
const animatedElements = document.querySelectorAll('.service-card, .feature-item, .gallery-item, .promo-item, .contact-item, .video-container');
animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    fadeInObserver.observe(el);
});

// ============================================
// PARALLAX EFFECT - Hero e CTA
// ============================================
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const ctaSection = document.querySelector('.cta-section');
    
    if (hero && window.innerWidth > 768) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
    
    if (ctaSection && window.innerWidth > 768) {
        const ctaOffset = ctaSection.offsetTop;
        if (scrolled > ctaOffset - window.innerHeight) {
            ctaSection.style.backgroundPositionY = (scrolled - ctaOffset) * 0.3 + 'px';
        }
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ============================================
// CONTADOR ANIMADO - Seção About
// ============================================
const animateCounter = (element, target, duration) => {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
};

// Observar seção about para iniciar contador
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (!stat.classList.contains('counted')) {
                    stat.classList.add('counted');
                    const target = parseInt(stat.textContent);
                    if (!isNaN(target)) {
                        animateCounter(stat, target, 2000);
                    }
                }
            });
        }
    });
}, { threshold: 0.3 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// ============================================
// VÍDEO PLACEHOLDERS - Efeito de Loading
// ============================================
document.querySelectorAll('.video-placeholder').forEach(placeholder => {
    placeholder.addEventListener('click', function() {
        const originalContent = this.innerHTML;
        
        this.innerHTML = `
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-color);"></i>
            <p style="margin-top: 20px;">Carregando vídeo...</p>
        `;
        
        // Simular carregamento de vídeo
        setTimeout(() => {
            this.innerHTML = originalContent;
            
            // Aqui você pode adicionar o código para carregar o vídeo real
            // Por exemplo: this.innerHTML = '<iframe src="URL_DO_VIDEO"></iframe>';
        }, 1500);
    });
});

// ============================================
// LIGHTBOX - Galeria de Imagens
// ============================================
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function() {
        // Criar lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${this.src}" alt="${this.alt}">
                <div class="lightbox-caption">${this.alt}</div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Estilo do lightbox
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
            cursor: pointer;
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: default;
        `;
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -50px;
            right: 0;
            font-size: 45px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10001;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(230, 30, 30, 0.8);
            border-radius: 50%;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(230, 30, 30, 1)';
            closeBtn.style.transform = 'rotate(90deg) scale(1.1)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(230, 30, 30, 0.8)';
            closeBtn.style.transform = 'rotate(0deg) scale(1)';
        });
        
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        `;
        
        const caption = lightbox.querySelector('.lightbox-caption');
        caption.style.cssText = `
            color: white;
            margin-top: 20px;
            font-size: 18px;
            text-align: center;
            padding: 10px 20px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
        `;
        
        // Fechar lightbox
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            }
        });
        
        // Fechar com ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    });
});

// ============================================
// EFEITO RIPPLE - Botões
// ============================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ============================================
// ANIMAÇÕES CSS DINÂMICAS
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// HOVER EFFECT - Service Cards
// ============================================
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ============================================
// SCROLL REVEAL - Seções
// ============================================
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.05 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
});

// ============================================
// ANIMAÇÃO DE BADGES PROMOCIONAIS
// ============================================
const promoBadges = document.querySelectorAll('.promo-badge, .service-promo, .featured-badge, .section-badge');
promoBadges.forEach((badge, index) => {
    badge.style.opacity = '0';
    badge.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        badge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        badge.style.opacity = '1';
        badge.style.transform = 'scale(1)';
    }, index * 100);
});

// ============================================
// LAZY LOADING - Imagens
// ============================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ============================================
// SCROLL TO TOP - Botão
// ============================================
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--gradient-primary);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 5px 20px rgba(230, 30, 30, 0.4);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
    scrollToTopBtn.style.boxShadow = '0 8px 30px rgba(230, 30, 30, 0.6)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
    scrollToTopBtn.style.boxShadow = '0 5px 20px rgba(230, 30, 30, 0.4)';
});

// ============================================
// PREVENÇÃO DE SCROLL HORIZONTAL
// ============================================
function preventHorizontalScroll() {
    const body = document.body;
    const html = document.documentElement;
    
    if (body.scrollWidth > window.innerWidth) {
        body.style.overflowX = 'hidden';
        html.style.overflowX = 'hidden';
    }
}

window.addEventListener('load', preventHorizontalScroll);
window.addEventListener('resize', preventHorizontalScroll);

// ============================================
// PERFORMANCE - Debounce para Resize
// ============================================
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

const handleResize = debounce(() => {
    // Fechar menu mobile ao redimensionar para desktop
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
        
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}, 250);

window.addEventListener('resize', handleResize);

// ============================================
// CONSOLE LOG - Mensagem de Boas-Vindas
// ============================================
console.log('%c🔥 FURA TUDO - Site Carregado com Sucesso! 🔥', 'color: #e61e1e; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%c✨ Todas as funcionalidades ativadas!', 'color: #25D366; font-size: 18px; font-weight: bold;');
console.log('%c💎 Desenvolvido com excelência', 'color: #0078D4; font-size: 14px; font-style: italic;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e61e1e;');
console.log('%cFuncionalidades Ativas:', 'color: #fff; font-size: 16px; font-weight: bold;');
console.log('%c✓ Menu Mobile Responsivo', 'color: #25D366; font-size: 14px;');
console.log('%c✓ Smooth Scroll', 'color: #25D366; font-size: 14px;');
console.log('%c✓ Parallax Effect', 'color: #25D366; font-size: 14px;');
console.log('%c✓ Lightbox Gallery', 'color: #25D366; font-size: 14px;');
console.log('%c✓ Scroll Animations', 'color: #25D366; font-size: 14px;');
console.log('%c✓ Ripple Effects', 'color: #25D366; font-size: 14px;');
console.log('%c✓ Lazy Loading', 'color: #25D366; font-size: 14px;');
console.log('%c✓ Scroll to Top', 'color: #25D366; font-size: 14px;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e61e1e;');

// ============================================
// INICIALIZAÇÃO COMPLETA
// ============================================
window.addEventListener('load', () => {
    // Remover loading screen se existir
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // Trigger inicial de animações
    window.dispatchEvent(new Event('scroll'));
    
    console.log('%c🚀 Site totalmente carregado e otimizado!', 'color: #FFD700; font-size: 16px; font-weight: bold;');
});