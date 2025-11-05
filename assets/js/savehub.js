const STORAGE_KEY = 'savehub-theme';

const handleTheme = () => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  const applyTheme = (mode) => {
    const resolvedMode = mode === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', resolvedMode);
    localStorage.setItem(STORAGE_KEY, resolvedMode);
  };

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    applyTheme(stored);
  } else {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
};

const handleHeaderState = () => {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 16) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
};

const handleMobileNav = () => {
  const toggler = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (!toggler || !mobileNav) return;

  const toggleNav = () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    toggler.setAttribute('aria-expanded', String(isOpen));
    toggler.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggler.addEventListener('click', toggleNav);

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('is-open')) {
        toggleNav();
      }
    });
  });
};

const handleRevealAnimations = () => {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  revealEls.forEach((el) => observer.observe(el));
};

const handleActiveNavigation = () => {
  const navLinks = document.querySelectorAll('.site-nav__link');
  if (!navLinks.length) return;

  const sections = Array.from(document.querySelectorAll('main section[id]'));

  const onScroll = () => {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let activeId = null;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
};

const handleFAQ = () => {
  const accordions = document.querySelectorAll('[data-accordion]');
  if (!accordions.length) return;

  accordions.forEach((item) => {
    const button = item.querySelector('button');
    const content = item.querySelector('.faq__content');
    if (!button || !content) return;

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      content.classList.toggle('is-open', !expanded);
    });
  });
};

const handleWaitlistForm = () => {
  const form = document.querySelector('[data-waitlist-form]');
  const success = document.querySelector('[data-form-success]');
  if (!form || !success) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput?.value) return;

    success.hidden = false;
    form.reset();

    setTimeout(() => {
      success.hidden = true;
    }, 6000);
  });
};

const handleCurrentYear = () => {
  const yearTarget = document.querySelector('[data-year]');
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  handleTheme();
  handleHeaderState();
  handleMobileNav();
  handleRevealAnimations();
  handleActiveNavigation();
  handleFAQ();
  handleWaitlistForm();
  handleCurrentYear();
});
