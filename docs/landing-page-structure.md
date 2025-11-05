## SaveHub Landing Page Blueprint

### A. Narrative Flow
1. **Hero (Make Rotational Savings Digital)**
   - Bold headline, subcopy, CTA buttons (`Join Waitlist`, `See Demo`).
   - Background gradient overlay, cultural motif pattern, subtle animated orbs.
2. **Social Proof Strip**
   - Logos of partner cooperatives/PSPs, community stats.
3. **Tradition Meets Technology**
   - Two-column section highlighting Ajoo, Esusu, Osusu roots with visuals.
   - Copy explaining SaveHub’s modernization mission.
4. **Problems We Solve**
   - Cards outlining trust, exclusion, manual processes, geographic limits.
5. **Product Showcase Carousel**
   - Desktop + mobile frame mockups with key UI states.
6. **Core Features (Hives)**
   - Circle creation, automated payouts, compliance, rewards.
   - Iconography consistent with brand palette.
7. **How SaveHub Works**
   - Stepper (1-5) with short copy + action verbs.
8. **Gamification & Rewards**
   - Leaderboard snippet, badges, referral multiplier.
9. **Testimonials & Success Stories**
   - Quotes from market traders, diaspora professionals.
10. **Roadmap & Traction**
    - Timeline (MVP → Phase 2) referencing product strategy.
11. **FAQ & Support**
    - Address onboarding, trust, payments, compliance.
12. **Call to Action Footer**
    - Waitlist form (email capture), contact, social handles, compliance badges.

### B. Design System References
- **Palette**: Navy `#0B1D3C`, Deep Blue `#071028`, Yellow `#FFD23C`, Orange `#FF8A3C`, Neutrals `#F5F7FA`, `#E2E8F0`.
- **Typography**: `Clash Display` or `Space Grotesk` for headings; `General Sans` or `Inter` for body.
- **Motifs**: Subtle African patterns, gradients with circular overlays, organic shapes.
- **Components**: Glassmorphism cards, gradient buttons, pill-shaped tags.

### C. Interaction Targets
- Sticky, translucent header with theme toggle placeholder.
- Smooth scroll navigation with active section indicator.
- Intersection Observer-based fade/slide animations (handled via CSS/JS fallbacks).
- Responsive design: mobile-first adjustments, stacked sections, collapsible FAQ accordion.

### D. Content Hooks
- Emphasize `Hives of 5`, `Automated Rotational Savings`, `Digital Trust Fabric`.
- Highlight compliance ready (KYC/AML), PSP integrations.
- Prominent link to `savehubafrica-mvp` login mock.

### E. Technical Implementation
- Build single-page app using semantic HTML5.
- Externalize CSS to `assets/css/savehub.css`.
- Vanilla JS for scroll/FAQ interactions in `assets/js/savehub.js`.
- Optimize for Lighthouse: meta tags, accessible contrast, alt text.
