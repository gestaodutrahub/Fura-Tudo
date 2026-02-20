// ============================================
// FURA TUDO - SCRIPT PRINCIPAL
// ============================================

// ============================================
// MODAL DE VÍDEO
// ============================================

function abrirModalVideo(src, titulo) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    const title = document.getElementById('modalVideoTitle');

    if (!modal || !video) return;

    title.textContent = titulo || 'Assistindo Vídeo';
    video.src = src;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    video.play();
}

function fecharModalVideo() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');

    if (!modal || !video) return;

    video.pause();
    video.currentTime = 0;
    video.src = '';

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function fecharModalAoClicarFora(e) {
    const modal = document.getElementById('videoModal');
    if (e.target === modal) {
        fecharModalVideo();
    }
}

// ESC para fechar
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('videoModal');
        if (modal && modal.classList.contains('active')) {
            fecharModalVideo();
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // ATIVAR CLICK NOS CARDS DE VÍDEO
    // ============================================

    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function () {
            const videoSrc = this.dataset.video;
            const videoTitle = this.dataset.title;
            abrirModalVideo(videoSrc, videoTitle);
        });
    });

    // Botão fechar
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', fecharModalVideo);
    }

    // Fechar clicando fora
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', fecharModalAoClicarFora);
    }

});

    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', fecharModalAoClicarFora);
    }

    const header        = document.querySelector('.header');
    const hamburger     = document.getElementById('hamburger');
    const sidebar       = document.getElementById('sidebar');
    const sidebarOverlay= document.getElementById('sidebarOverlay');
    const sidebarClose  = document.getElementById('sidebarClose');
    const sidebarLinks  = document.querySelectorAll('.sidebar-nav a');
    const scrollToTopBtn= document.getElementById('scrollToTop');

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // ============================================
    // SIDEBAR MOBILE
    // ============================================

    function openSidebar() {
        if (!sidebar || !sidebarOverlay || !hamburger) return;
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (!sidebar || !sidebarOverlay || !hamburger) return;
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger)      hamburger.addEventListener('click', openSidebar);
    if (sidebarClose)   sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    sidebarLinks.forEach(link => link.addEventListener('click', closeSidebar));

    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768) closeSidebar();
    }, 250));

    // ============================================
    // HEADER - EFEITO DE SCROLL
    // ============================================

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                header.style.background     = 'rgba(10, 10, 10, 0.98)';
                header.style.boxShadow      = '0 5px 20px rgba(230, 30, 30, 0.3)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background     = 'rgba(10, 10, 10, 0.95)';
                header.style.boxShadow      = 'none';
                header.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);

            if (target && header) {
                e.preventDefault();

                const headerHeight   = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // SCROLL TO TOP
    // ============================================

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // ANIMAÇÃO FADE-IN AO SCROLL
    // ============================================

    const fadeItems = document.querySelectorAll('.fade-in-up');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = Array.from(entry.target.parentElement.children);
                const index    = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = (index * 0.08) + 's';
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeItems.forEach(el => fadeObserver.observe(el));

    // ============================================
    // PARALLAX HERO
    // ============================================

    let ticking = false;

    function updateParallax() {
        if (window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) hero.style.backgroundPositionY = scrolled * 0.4 + 'px';
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
    // LAZY LOADING - IMAGENS
    // ============================================

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));

    // ============================================
    // PREVENÇÃO DE SCROLL HORIZONTAL
    // ============================================

    function preventHorizontalScroll() {
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowX = 'hidden';
    }

    preventHorizontalScroll();
    window.addEventListener('resize', debounce(preventHorizontalScroll, 100));

    // ============================================
    // FORÇAR EVENTO DE SCROLL NA CARGA
    // ============================================

    window.dispatchEvent(new Event('scroll'));

    // ============================================
    // CONSOLE LOG
    // ============================================

    console.log('%c🔥 FURA TUDO - Site Carregado! 🔥', 'color:#e61e1e;font-size:22px;font-weight:bold;');
    console.log('%c✅ Todas as funcionalidades ativas!', 'color:#25D366;font-size:15px;');
