/* Scripts da interface */

document.addEventListener('DOMContentLoaded', () => {
    
    // Efeito de scroll no cabecalho
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 20) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Abre e fecha a busca
    const btnSearch = document.getElementById('btn-search');
    const searchBar = document.getElementById('search-bar');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const btnNotif = document.getElementById('btn-notif');
    const notificationsPopover = document.getElementById('notifications-popover');
    const btnMenu = document.getElementById('btn-menu');
    const accountMenu = document.getElementById('account-menu');
    
    btnSearch.addEventListener('click', () => {
        searchBar.classList.toggle('search-bar--open');
        if (searchBar.classList.contains('search-bar--open')) {
            setTimeout(() => searchInput.focus(), 300);
        }
    });
    
    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('search-bar--open');
        searchInput.value = '';
    });

    // Abre e fecha o menu da conta e notificacoes
    function setAccountMenuOpen(isOpen) {
        if (!btnMenu || !accountMenu) return;
        accountMenu.hidden = !isOpen;
        btnMenu.setAttribute('aria-expanded', String(isOpen));
    }

    function setNotificationsOpen(isOpen) {
        if (!btnNotif || !notificationsPopover) return;
        notificationsPopover.hidden = !isOpen;
        btnNotif.setAttribute('aria-expanded', String(isOpen));
    }

    if (btnNotif && notificationsPopover) {
        btnNotif.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = !notificationsPopover.hidden;
            setNotificationsOpen(!isOpen);
            setAccountMenuOpen(false);
        });
    }

    if (btnMenu && accountMenu) {
        btnMenu.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = !accountMenu.hidden;
            setAccountMenuOpen(!isOpen);
            setNotificationsOpen(false);
        });

        document.addEventListener('click', (event) => {
            const clickedInsideMenu = accountMenu.contains(event.target);
            const clickedMenuButton = btnMenu.contains(event.target);
            const clickedInsideNotifications = notificationsPopover && notificationsPopover.contains(event.target);
            const clickedNotificationButton = btnNotif && btnNotif.contains(event.target);

            if (!clickedInsideMenu && !clickedMenuButton) {
                setAccountMenuOpen(false);
            }

            if (!clickedInsideNotifications && !clickedNotificationButton) {
                setNotificationsOpen(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setAccountMenuOpen(false);
                setNotificationsOpen(false);
            }
        });
    }

    // Acoes da barra do marketplace no mobile
    const filterToggleBtn = document.querySelector('[data-filter-toggle]');
    const focusSearchBtn = document.querySelector('[data-focus-search]');
    const marketplaceFilters = document.querySelector('.marketplace__filters');
    const marketplaceSearchInput = document.querySelector('.results-search input');

    function setFiltersOpen(isOpen) {
        if (!marketplaceFilters || !filterToggleBtn) return;

        marketplaceFilters.classList.toggle('marketplace__filters--open', isOpen);
        filterToggleBtn.setAttribute('aria-expanded', String(isOpen));

        const icon = filterToggleBtn.querySelector('.material-symbols-rounded');
        if (icon) {
            icon.textContent = isOpen ? 'close' : 'tune';
        }
    }

    if (filterToggleBtn && marketplaceFilters) {
        setFiltersOpen(false);

        filterToggleBtn.addEventListener('click', () => {
            const open = marketplaceFilters.classList.contains('marketplace__filters--open');
            setFiltersOpen(!open);
        });

        document.addEventListener('click', (event) => {
            const clickedInsideFilter = marketplaceFilters.contains(event.target);
            const clickedToggle = filterToggleBtn.contains(event.target);
            if (!clickedInsideFilter && !clickedToggle) {
                setFiltersOpen(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 680) {
                setFiltersOpen(false);
            }
        }, { passive: true });
    }

    if (focusSearchBtn && marketplaceSearchInput) {
        focusSearchBtn.addEventListener('click', () => {
            marketplaceSearchInput.focus();
        });
    }
    
    // Animacao dos numeros do hero
    function animateCounters() {
        const counters = document.querySelectorAll('.hero__stat-number[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 1500;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Curva de aceleracao para a animacao
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);
                
                counter.textContent = current.toLocaleString('pt-BR');
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        });
    }
    
    // Animacoes ao entrar na tela
    const revealElements = document.querySelectorAll('.section, .top-provider, .offer-card, .step');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
                
                // Inicia os contadores quando o hero aparece
                if (entry.target.closest('.hero') || entry.target.classList.contains('hero')) {
                    animateCounters();
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
    
    // Observa o hero para animar contadores uma vez
    const hero = document.getElementById('hero');
    if (hero) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });
        heroObserver.observe(hero);
    }
    
    // Controle dos pontos do carrossel
    const carousel = document.getElementById('featured-carousel');
    const dotsContainer = document.getElementById('featured-dots');
    
    if (carousel && dotsContainer) {
        const cards = carousel.querySelectorAll('.provider-card');
        
        // Cria os pontos
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dots__dot${i === 0 ? ' carousel-dots__dot--active' : ''}`;
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => {
                cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            });
            dotsContainer.appendChild(dot);
        });
        
        // Atualiza ponto ativo no scroll
        const dots = dotsContainer.querySelectorAll('.carousel-dots__dot');
        
        carousel.addEventListener('scroll', () => {
            const scrollLeft = carousel.scrollLeft;
            const cardWidth = cards[0].offsetWidth + 16; // largura do card + espaco
            const current = Math.round(scrollLeft / cardWidth);
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('carousel-dots__dot--active', i === current);
            });
        }, { passive: true });
    }
    
    // Efeito visual de clique
    document.querySelectorAll('.category-card, .btn, .top-provider, .offer-card').forEach(el => {
        el.addEventListener('click', function(e) {
            // Cria o efeito
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
                background: rgba(17, 111, 193, 0.16);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out forwards;
                pointer-events: none;
                z-index: 0;
            `;
            
            this.style.position = this.style.position || 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Adiciona animacao do efeito
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Item ativo da navegacao mobile
    const bottomNavItems = document.querySelectorAll('.bottom-nav__item');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.id;
            }
        });
        
        bottomNavItems.forEach(item => {
            item.classList.remove('bottom-nav__item--active');
            const href = item.getAttribute('href');
            if (href && href.includes(current)) {
                item.classList.add('bottom-nav__item--active');
            }
        });
    }, { passive: true });
    
    // Formulario de newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');
            
            btn.innerHTML = '<span class="material-symbols-rounded">check</span> Inscrito!';
            btn.style.background = 'linear-gradient(135deg, #00D68F, #00B894)';
            input.value = '';
            
            setTimeout(() => {
                btn.innerHTML = '<span class="material-symbols-rounded">send</span> Inscrever';
                btn.style.background = '';
            }, 3000);
        });
    }
    
    // Efeito de movimento no card VIP
    const vipCard = document.querySelector('.vip__card');
    if (vipCard) {
        vipCard.addEventListener('mousemove', (e) => {
            const rect = vipCard.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const glow = vipCard.querySelector('.vip__glow');
            if (glow) {
                glow.style.left = `${x - 50}%`;
                glow.style.top = `${y - 50}%`;
            }
        });
    }

    // Atraso de animacao dos cards de profissionais
    const topProviders = document.querySelectorAll('.top-provider');
    topProviders.forEach((provider, index) => {
        provider.style.transitionDelay = `${index * 0.08}s`;
    });

    // Atraso de animacao dos cards de oferta
    const offerCards = document.querySelectorAll('.offer-card');
    offerCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Atraso de animacao dos cards de categoria
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.05}s`;
    });
    
});
