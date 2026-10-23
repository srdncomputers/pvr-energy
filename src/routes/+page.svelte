<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Carousel from '$lib/Carousel.svelte';
  import AdminPanel from '$lib/AdminPanel.svelte';
  import WaIcon from '$lib/WaIcon.svelte';

  // All editable text/pictures come from the server (saved by the admin, merged over defaults)
  export let data;
  let content = data.content;
  $: b = content.business;
  $: slides = content.hero.slides;
  $: waNumber = (b.whatsapp || '').replace(/\D/g, '');

  // Public gallery (fetched from /api/gallery — published items only)
  let galleryImages = [];
  let galleryLoading = true;

  let showAdmin = false;
  let mobileMenuOpen = false;
  let activeSection = 'home';

  async function loadPublicGallery() {
    try {
      const res = await fetch('/api/gallery');
      galleryImages = res.ok ? await res.json() : [];
    } catch {
      galleryImages = [];
    }
    galleryLoading = false;
  }

  function whatsapp(msg = '') {
    const text = encodeURIComponent(msg || `Hello ${b.name} ${b.tagline}! I am interested in solar installation for my property in Bangalore.`);
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  }
  function scrollTo(id) {
    mobileMenuOpen = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Hero slide carousel ──
  let heroActive = 0;
  let heroTimer;
  $: if (heroActive >= slides.length) heroActive = 0;
  function goHero(i) {
    heroActive = (i + slides.length) % slides.length;
    startHeroTimer();
  }
  function startHeroTimer() {
    stopHeroTimer();
    heroTimer = setInterval(() => { heroActive = (heroActive + 1) % slides.length; }, 6000);
  }
  function stopHeroTimer() {
    if (heroTimer) clearInterval(heroTimer);
  }

  onMount(() => {
    loadPublicGallery();
    startHeroTimer();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) activeSection = e.target.id; }
    }, { threshold: 0.3 });
    ['home','about','services','gallery','testimonials','contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => { observer.disconnect(); stopHeroTimer(); };
  });

  const navItems = [['home','Home'],['about','About'],['services','Services'],['gallery','Gallery'],['testimonials','Reviews'],['contact','Contact']];
</script>

<svelte:head>
  <title>{b.name} {b.tagline} — Solar Installation Bangalore | Electronic City | Anekal | Attibele</title>
  <meta name="description" content="Bangalore's trusted solar installation company. Serving Electronic City, Anekal, Attibele, Jigani. BESCOM approved. Free site visit. WhatsApp: {b.phoneDisplay}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Noto+Sans+Kannada:wght@400;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<!-- WHATSAPP FLOAT -->
<button class="wa-float" on:click={() => whatsapp()} title="Chat on WhatsApp">
  <WaIcon size={28} />
  <span>Chat with Us</span>
</button>

<!-- TOPBAR -->
<div class="topbar">
  <div class="topbar-inner">
    <div class="topbar-left">
      <a href="mailto:{b.email}" class="topbar-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        {b.email}
      </a>
      <span class="topbar-sep">|</span>
      <span class="topbar-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        {b.location}
      </span>
    </div>
    <div class="topbar-right">
      <button class="topbar-wa" on:click={() => whatsapp()}>
        <WaIcon size={13} />
        {b.phoneDisplay}
      </button>
    </div>
  </div>
</div>

<!-- NAVBAR -->
<nav class="navbar">
  <div class="nav-inner">
    <div class="nav-logo" on:click={() => scrollTo('home')}>
      <div class="logo-icon">☀️</div>
      <div>
        <div class="logo-name">{b.name}</div>
        <div class="logo-sub">{b.tagline}</div>
      </div>
    </div>
    <div class="nav-links">
      {#each navItems as [id, label]}
        <button class="nav-link" class:active={activeSection === id} on:click={() => scrollTo(id)}>{label}</button>
      {/each}
    </div>
    <div class="nav-actions">
      <button class="nav-quote" on:click={() => whatsapp('Hi! I want a free solar consultation for my property in Bangalore.')}>Get Free Quote</button>
      <button class="nav-admin" on:click={() => showAdmin = !showAdmin} title="Admin">⚙</button>
      <button class="nav-hamburger" on:click={() => mobileMenuOpen = !mobileMenuOpen}>{mobileMenuOpen ? '✕' : '☰'}</button>
    </div>
  </div>
  {#if mobileMenuOpen}
    <div class="mobile-menu">
      {#each navItems as [id, label]}
        <button class="mobile-link" on:click={() => scrollTo(id)}>{label}</button>
      {/each}
      <button class="mobile-quote" on:click={() => whatsapp()}>📱 WhatsApp Us Now</button>
    </div>
  {/if}
</nav>

<!-- ADMIN PANEL -->
{#if showAdmin}
  <AdminPanel
    on:close={() => (showAdmin = false)}
    on:saved={(e) => (content = e.detail)}
    on:gallery={loadPublicGallery}
  />
{/if}

<!-- ══ HERO ══ -->
<section id="home" class="hero" on:mouseenter={stopHeroTimer} on:mouseleave={startHeroTimer}>
  <div class="hero-slides">
    {#each slides as slide, i}
      <div class="hero-slide" class:active={i === heroActive} style="background-image:url('{slide.image}')"></div>
    {/each}
  </div>
  <div class="hero-slide-overlay"></div>

  <div class="hero-row">
    <div class="hero-content">
      {#key heroActive}
        <div in:fade={{ duration: 450 }}>
          <div class="hero-badge">{slides[heroActive].tag}</div>
          <h1>{slides[heroActive].title}</h1>
          <p>{slides[heroActive].sub}</p>
        </div>
      {/key}
      <div class="hero-actions">
        <button class="hero-btn primary" on:click={() => whatsapp('Hi! I want a FREE solar site visit for my property.')}>
          <WaIcon size={18} />
          Book Free Site Visit
        </button>
        <button class="hero-btn secondary" on:click={() => scrollTo('services')}>Our Services</button>
      </div>
      <div class="hero-tags">
        {#each content.hero.tags as tag}<span>✅ {tag}</span>{/each}
      </div>
    </div>

    <div class="hero-kannada">
      <div class="kn-card">
        <div class="kn-sun">☀️</div>
        <h2 class="kn-title">{content.hero.kannada.title}</h2>
        <p class="kn-sub">{content.hero.kannada.sub}</p>
        <div class="kn-divider"></div>
        <ul class="kn-points">
          {#each content.hero.kannada.points as pt}<li><span class="kn-dot"></span>{pt}</li>{/each}
        </ul>
        <button class="kn-btn" on:click={() => whatsapp('ನಮಸ್ಕಾರ! ನಾನು ಸೌರ ಶಕ್ತಿ ಅಳವಡಿಕೆ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು.')}>
          {content.hero.kannada.button}
        </button>
        <p class="kn-number">📱 {b.phoneDisplay}</p>
      </div>
    </div>
  </div>

  <div class="hero-bottom-bar">
    {#key heroActive}
      <div class="hero-caption" in:fade={{ duration: 450, delay: 100 }}>
        <span class="hc-num">{slides[heroActive].bottomStat}</span>
        <span class="hc-label">{slides[heroActive].bottomLabel}</span>
      </div>
    {/key}
    <div class="hero-dots" role="tablist" aria-label="Hero slides">
      {#each slides as _, i}
        <button
          class="hero-dot"
          class:active={i === heroActive}
          role="tab"
          aria-selected={i === heroActive}
          aria-label={`Go to slide ${i + 1}`}
          on:click={() => goHero(i)}
        ></button>
      {/each}
    </div>
  </div>

  <div class="hero-stats">
    {#each content.stats as s}
      <div class="hero-stat">
        <div class="hs-num">{s.num}</div>
        <div class="hs-label">{s.label}</div>
      </div>
    {/each}
  </div>
</section>

<!-- ABOUT -->
<section id="about" class="about section">
  <div class="container">
    <div class="about-grid">
      <div class="about-img-wrap">
        <img src={content.about.image} alt="{b.name} {b.tagline} team" class="about-img"/>
        <div class="about-img-badge"><div class="aib-num">{content.about.badgeNum}</div><div class="aib-label">{content.about.badgeLabel}</div></div>
      </div>
      <div class="about-content">
        <div class="section-tag">🏙️ About Us</div>
        <h2>{content.about.title}</h2>
        {#each content.about.paragraphs as para}<p>{para}</p>{/each}
        <div class="about-highlights">
          {#each content.about.highlights as h}
            <div class="ah-item"><span class="ah-icon">{h.icon}</span><div><strong>{h.title}</strong><br/><small>{h.sub}</small></div></div>
          {/each}
        </div>
        <button class="btn-primary" on:click={() => whatsapp(`Hi! I want to know more about ${b.name} ${b.tagline}.`)}>Talk to Our Team →</button>
      </div>
    </div>
  </div>
</section>

<!-- SERVICES -->
<section id="services" class="services section section-alt">
  <div class="container">
    <div class="section-header">
      <div class="section-tag">⚡ What We Do</div>
      <h2>Our Solar &amp; Energy Services</h2>
      <p>Complete energy solutions for homes, businesses and industries across Bangalore</p>
    </div>
    <div class="services-grid">
      {#each content.services as svc}
        <div class="service-card">
          {#if svc.badge}<span class="svc-badge">{svc.badge}</span>{/if}
          <div class="svc-icon">{svc.icon}</div>
          <h3>{svc.title}</h3>
          <p>{svc.desc}</p>
          <button class="svc-btn" on:click={() => whatsapp(`Hi! I'm interested in ${svc.title}. Please share more details.`)}>Get Quote on WhatsApp →</button>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- HOW WE WORK -->
<section class="workflow section">
  <div class="container">
    <div class="section-header">
      <div class="section-tag">🔄 Our Process</div>
      <h2>How We Work</h2>
      <p>Simple, transparent, and hassle-free — from your first call to final handover</p>
    </div>
    <div class="workflow-grid">
      {#each content.workflow as step}
        <div class="wf-step">
          <div class="wf-num">{step.num}</div>
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- GALLERY -->
<section id="gallery" class="gallery section section-alt">
  <div class="container">
    <div class="section-header">
      <div class="section-tag">📸 Our Work</div>
      <h2>Project Gallery</h2>
      <p>Real installations across Bangalore — homes, shops, factories and more</p>
    </div>
    {#if galleryLoading}
      <div class="gallery-empty">Loading photos…</div>
    {:else}
      <Carousel items={galleryImages} />
    {/if}
  </div>
</section>

<!-- TESTIMONIALS -->
<section id="testimonials" class="testimonials section">
  <div class="container">
    <div class="section-header">
      <div class="section-tag">⭐ Customer Reviews</div>
      <h2>What Bangalore Customers Say</h2>
      <p>Trusted by homeowners and businesses across South Bangalore</p>
    </div>
    <div class="testi-grid">
      {#each content.testimonials as t}
        <div class="testi-card">
          <div class="testi-stars">⭐⭐⭐⭐⭐</div>
          <p>"{t.text}"</p>
          <div class="testi-author">
            <div class="testi-avatar">{(t.name || '?')[0]}</div>
            <div><strong>{t.name}</strong><span>📍 {t.location}</span></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA STRIP -->
<section class="cta-strip">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-text">
        <h2>Ready to Switch to Solar?</h2>
        <p>Get a FREE site visit and customised quote for your Bangalore property today</p>
      </div>
      <div class="cta-actions">
        <button class="cta-wa" on:click={() => whatsapp(`Hi ${b.name}! I want a FREE solar consultation.`)}>
          <WaIcon size={20} />
          WhatsApp: {b.phoneDisplay}
        </button>
        <a href="mailto:{b.email}" class="cta-email">📧 {b.email}</a>
      </div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact" class="contact section">
  <div class="container">
    <div class="section-header">
      <div class="section-tag">📞 Get In Touch</div>
      <h2>Contact {b.name} {b.tagline}</h2>
      <p>Reach us on WhatsApp, email or visit us in Bangalore</p>
    </div>
    <div class="contact-grid">
      <div class="contact-info">
        <div class="ci-item">
          <div class="ci-icon">📍</div>
          <div><strong>Service Area</strong><p>{b.address}<br/>{b.serviceAreas}</p></div>
        </div>
        <div class="ci-item">
          <div class="ci-icon">📱</div>
          <div><strong>WhatsApp / Call</strong><p>{b.phoneDisplay}</p><button class="contact-wa-btn" on:click={() => whatsapp()}>Open WhatsApp Chat</button></div>
        </div>
        <div class="ci-item">
          <div class="ci-icon">📧</div>
          <div><strong>Email</strong><p><a href="mailto:{b.email}">{b.email}</a></p></div>
        </div>
        <div class="ci-item">
          <div class="ci-icon">🕐</div>
          <div><strong>Working Hours</strong><p class="preline">{b.hours}</p></div>
        </div>
      </div>
      <div class="contact-form-wrap">
        <h3>Send us a Message</h3>
        <form class="contact-form" on:submit|preventDefault={(e) => { const fd = new FormData(e.target); whatsapp(`Name: ${fd.get('name')}\nPhone: ${fd.get('phone')}\nLocation: ${fd.get('location')}\nService: ${fd.get('service')}\nMessage: ${fd.get('message')}`); }}>
          <div class="cf-row">
            <div class="cf-group"><label for="name">Your Name *</label><input id="name" name="name" required placeholder="e.g. Rajesh Kumar"/></div>
            <div class="cf-group"><label for="phone">Phone Number *</label><input id="phone" name="phone" required placeholder="+91 98XXX XXXXX"/></div>
          </div>
          <div class="cf-group"><label for="location">Property Location</label><input id="location" name="location" placeholder="e.g. Electronic City Phase 1"/></div>
          <div class="cf-group">
            <label for="service">Service Required</label>
            <select id="service" name="service">
              {#each content.services as s}<option>{s.title}</option>{/each}
            </select>
          </div>
          <div class="cf-group"><label for="message">Message</label><textarea id="message" name="message" rows="4" placeholder="Tell us about your property, electricity bill amount, rooftop size..."></textarea></div>
          <button type="submit" class="cf-submit">
            <WaIcon size={18} />
            Send via WhatsApp
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">☀️ {b.name} {b.tagline}</div>
        <p>{b.footerAbout}</p>
        <button class="footer-wa" on:click={() => whatsapp()}>
          <WaIcon size={16} />
          {b.phoneDisplay}
        </button>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul>
          {#each content.services as s}<li>{s.title}</li>{/each}
        </ul>
      </div>
      <div class="footer-col">
        <h4>Service Areas</h4>
        <ul>
          <li>Electronic City (Phase 1 &amp; 2)</li><li>Anekal</li>
          <li>Attibele</li><li>Jigani</li>
          <li>Hosa Road</li><li>Bangalore Rural District</li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li>📱 {b.phoneDisplay}</li>
          <li>📧 {b.email}</li>
          <li>📍 {b.location}</li>
          <li>🕐 {b.footerHours}</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© {new Date().getFullYear()} {b.name} {b.tagline}. All rights reserved. | {b.location}</p>
      <p>Designed &amp; Developed by <strong>SRDN Technologies</strong></p>
    </div>
  </div>
</footer>

<style>
  :global(*){box-sizing:border-box;margin:0;padding:0;}
  :global(body){font-family:'Poppins',sans-serif;color:#1a1a1a;line-height:1.6;overflow-x:hidden;}
  :global(a){text-decoration:none;color:inherit;}
  :global(button){cursor:pointer;font-family:'Poppins',sans-serif;}
  :global(input,select,textarea){font-family:'Poppins',sans-serif;}
  :global(img){max-width:100%;height:auto;}
  :global(:root){
    --orange:#f97316;--orange-dark:#ea580c;--orange-light:#fff7ed;
    --green:#16a34a;--navy:#0f172a;--text:#374151;--text-light:#6b7280;
    --border:#e5e7eb;--wa-green:#25d366;--wa-dark:#128c7e;
  }
  .preline{white-space:pre-line;}
  .container{max-width:1200px;margin:0 auto;padding:0 20px;}
  .section{padding:80px 0;}
  .section-alt{background:#f9fafb;}
  .section-tag{display:inline-block;background:var(--orange-light);color:var(--orange);font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px;margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em;}
  .section-header{text-align:center;margin-bottom:56px;}
  .section-header h2{font-size:clamp(26px,4vw,38px);font-weight:800;color:var(--navy);margin-bottom:12px;}
  .section-header p{font-size:16px;color:var(--text-light);max-width:560px;margin:0 auto;}

  /* WA FLOAT */
  .wa-float{position:fixed;bottom:28px;right:28px;z-index:1000;background:var(--wa-green);color:#fff;border:none;border-radius:999px;padding:12px 20px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;box-shadow:0 4px 20px rgba(37,211,102,.5);transition:transform 0.2s,box-shadow 0.2s;}
  .wa-float:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(37,211,102,.6);}
  @media(max-width:600px){.wa-float span{display:none;}.wa-float{padding:14px;border-radius:50%;}}

  /* TOPBAR */
  .topbar{background:var(--navy);color:#e2e8f0;font-size:12px;}
  .topbar-inner{max-width:1200px;margin:0 auto;padding:8px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;}
  .topbar-left{display:flex;align-items:center;gap:14px;}
  .topbar-link{display:flex;align-items:center;gap:5px;color:#cbd5e1;transition:color 0.15s;}
  .topbar-link:hover{color:#f97316;}
  .topbar-sep{color:#475569;}
  .topbar-wa{display:flex;align-items:center;gap:6px;background:var(--wa-green);color:#fff;border:none;border-radius:5px;padding:5px 12px;font-size:12px;font-weight:600;transition:background 0.15s;}
  .topbar-wa:hover{background:var(--wa-dark);}

  /* NAVBAR */
  .navbar{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,.06);}
  .nav-inner{max-width:1200px;margin:0 auto;padding:0 20px;display:flex;align-items:center;height:70px;gap:24px;}
  .nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;flex-shrink:0;}
  .logo-icon{font-size:32px;filter:drop-shadow(0 0 8px rgba(249,115,22,.4));}
  .logo-name{font-size:18px;font-weight:800;color:var(--orange);line-height:1;}
  .logo-sub{font-size:10px;color:var(--text-light);font-weight:500;letter-spacing:.06em;text-transform:uppercase;}
  .nav-links{display:flex;gap:4px;margin-left:auto;}
  .nav-link{background:none;border:none;padding:8px 14px;border-radius:8px;font-size:14px;font-weight:500;color:var(--text);transition:all 0.15s;}
  .nav-link:hover,.nav-link.active{background:var(--orange-light);color:var(--orange);}
  .nav-actions{display:flex;align-items:center;gap:8px;margin-left:16px;}
  .nav-quote{background:var(--orange);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;white-space:nowrap;transition:background 0.15s;}
  .nav-quote:hover{background:var(--orange-dark);}
  .nav-admin{background:var(--border);border:none;width:34px;height:34px;border-radius:8px;font-size:15px;display:flex;align-items:center;justify-content:center;}
  .nav-hamburger{display:none;background:none;border:1px solid var(--border);width:38px;height:38px;border-radius:8px;font-size:18px;}
  .mobile-menu{background:#fff;border-top:1px solid var(--border);padding:16px 20px;display:flex;flex-direction:column;gap:4px;}
  .mobile-link{background:none;border:none;text-align:left;padding:10px 14px;border-radius:8px;font-size:15px;font-weight:500;color:var(--text);}
  .mobile-link:hover{background:var(--orange-light);color:var(--orange);}
  .mobile-quote{background:var(--wa-green);color:#fff;border:none;border-radius:10px;padding:12px;font-size:15px;font-weight:700;margin-top:8px;}
  @media(max-width:900px){.nav-links{display:none;}.nav-hamburger{display:flex;align-items:center;justify-content:center;}}
  @media(max-width:600px){.nav-quote{display:none;}}

  /* ══ HERO ══ */
  .hero{
    min-height:calc(100vh - 107px);
    background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#164e35 100%);
    position:relative;overflow:hidden;display:flex;flex-direction:column;
    justify-content:center;padding:80px 20px 40px;color:#fff;
  }
  .hero-slides{position:absolute;inset:0;z-index:0;}
  .hero-slide{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transition:opacity 1.4s ease;}
  .hero-slide.active{opacity:.28;}
  .hero-slide-overlay{position:absolute;inset:0;z-index:0;background:linear-gradient(135deg,rgba(15,23,42,.65) 0%,rgba(30,58,95,.55) 50%,rgba(22,78,53,.6) 100%);}

  .hero-row{
    position:relative;z-index:1;max-width:1200px;margin:0 auto;width:100%;
    display:grid;grid-template-columns:1fr 420px;gap:48px;align-items:center;
  }
  .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(249,115,22,.2);border:1px solid rgba(249,115,22,.4);color:#fed7aa;font-size:13px;font-weight:600;padding:6px 14px;border-radius:999px;margin-bottom:20px;}
  .hero-content h1{font-size:clamp(32px,5vw,58px);font-weight:900;line-height:1.1;margin-bottom:16px;text-shadow:0 2px 20px rgba(0,0,0,.3);white-space:pre-line;}
  .hero-content p{font-size:16px;color:#cbd5e1;margin-bottom:32px;}
  .hero-actions{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:32px;}
  .hero-btn{display:flex;align-items:center;gap:8px;border:none;border-radius:12px;padding:14px 26px;font-size:15px;font-weight:700;transition:all 0.2s;}
  .hero-btn.primary{background:var(--wa-green);color:#fff;box-shadow:0 4px 20px rgba(37,211,102,.4);}
  .hero-btn.primary:hover{background:var(--wa-dark);transform:translateY(-2px);}
  .hero-btn.secondary{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.3);}
  .hero-btn.secondary:hover{background:rgba(255,255,255,.2);}
  .hero-tags{display:flex;gap:8px;flex-wrap:wrap;}
  .hero-tags span{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#e2e8f0;font-size:12px;font-weight:500;padding:4px 12px;border-radius:999px;}

  .hero-kannada{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;}
  .kn-card{
    background:linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.06));
    backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,.25);
    border-radius:20px;
    padding:32px 28px;
    width:100%;
    box-shadow:0 8px 40px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.2);
  }
  .kn-sun{font-size:42px;display:block;margin-bottom:12px;text-align:center;filter:drop-shadow(0 0 12px rgba(251,191,36,.6));}
  .kn-title{
    font-family:'Noto Sans Kannada','Poppins',sans-serif;
    font-size:28px;font-weight:800;color:#fff;
    line-height:1.3;margin-bottom:8px;text-align:center;white-space:pre-line;
    text-shadow:0 2px 12px rgba(0,0,0,.3);
  }
  .kn-sub{font-family:'Noto Sans Kannada','Poppins',sans-serif;font-size:14px;color:#fed7aa;text-align:center;font-weight:500;margin-bottom:16px;}
  .kn-divider{height:1px;background:rgba(255,255,255,.2);margin:16px 0;}
  .kn-points{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
  .kn-points li{display:flex;align-items:center;gap:10px;font-family:'Noto Sans Kannada','Poppins',sans-serif;font-size:13px;color:#e2e8f0;font-weight:500;}
  .kn-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px rgba(74,222,128,.7);flex-shrink:0;}
  .kn-btn{
    width:100%;background:var(--orange);color:#fff;border:none;border-radius:10px;padding:12px;
    font-family:'Noto Sans Kannada','Poppins',sans-serif;font-size:15px;font-weight:700;
    transition:background 0.15s,transform 0.15s;margin-bottom:12px;box-shadow:0 4px 16px rgba(249,115,22,.4);
  }
  .kn-btn:hover{background:var(--orange-dark);transform:translateY(-1px);}
  .kn-number{font-family:'Poppins',sans-serif;text-align:center;color:#94a3b8;font-size:13px;}

  .hero-bottom-bar{
    position:relative;z-index:1;max-width:1200px;margin:40px auto 0;width:100%;
    display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:18px;
    padding-top:26px;border-top:1px solid rgba(255,255,255,.15);
  }
  .hero-caption{display:flex;align-items:baseline;gap:10px;min-height:32px;}
  .hc-num{font-size:26px;font-weight:900;color:var(--orange);}
  .hc-label{font-size:13px;color:#cbd5e1;font-weight:500;}
  .hero-dots{display:flex;gap:9px;align-items:center;}
  .hero-dot{width:9px;height:9px;border-radius:999px;background:rgba(255,255,255,.35);border:none;padding:0;cursor:pointer;transition:all .3s ease;}
  .hero-dot:hover{background:rgba(255,255,255,.65);}
  .hero-dot.active{width:30px;background:var(--orange);box-shadow:0 0 10px rgba(249,115,22,.6);}

  .hero-stats{position:relative;z-index:1;max-width:1200px;margin:32px auto 0;width:100%;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.1);border-radius:16px;overflow:hidden;}
  .hero-stat{background:rgba(0,0,0,.2);backdrop-filter:blur(10px);padding:24px;text-align:center;}
  .hs-num{font-size:36px;font-weight:900;color:var(--orange);}
  .hs-label{font-size:13px;color:#94a3b8;font-weight:500;}

  @media(max-width:960px){
    .hero-row{grid-template-columns:1fr;gap:32px;}
    .hero-kannada{max-width:480px;width:100%;}
  }
  @media(max-width:700px){
    .hero-stats{grid-template-columns:1fr 1fr;}
    .hero-bottom-bar{justify-content:center;text-align:center;}
  }

  /* ABOUT */
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
  .about-img-wrap{position:relative;}
  .about-img{width:100%;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.15);object-fit:cover;height:480px;}
  .about-img-badge{position:absolute;bottom:-20px;right:-20px;background:var(--orange);color:#fff;border-radius:16px;padding:20px 24px;text-align:center;box-shadow:0 8px 24px rgba(249,115,22,.4);}
  .aib-num{font-size:40px;font-weight:900;line-height:1;}
  .aib-label{font-size:12px;font-weight:600;line-height:1.4;white-space:pre-line;}
  .about-content{display:flex;flex-direction:column;gap:16px;}
  .about-content h2{font-size:clamp(26px,4vw,38px);font-weight:800;color:var(--navy);line-height:1.2;white-space:pre-line;}
  .about-content p{color:var(--text);line-height:1.8;font-size:15px;}
  .about-highlights{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:8px 0;}
  .ah-item{display:flex;align-items:flex-start;gap:10px;background:#f9fafb;border-radius:10px;padding:12px;}
  .ah-icon{font-size:22px;flex-shrink:0;}
  .ah-item strong{font-size:13px;color:var(--navy);display:block;}
  .ah-item small{font-size:11px;color:var(--text-light);}
  .btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--orange);color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:700;transition:background 0.15s;width:fit-content;}
  .btn-primary:hover{background:var(--orange-dark);}
  @media(max-width:800px){.about-grid{grid-template-columns:1fr;}.about-img{height:280px;}.about-img-badge{right:10px;bottom:10px;}}

  /* SERVICES */
  .services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
  .service-card{background:#fff;border-radius:16px;padding:28px;border:1px solid var(--border);position:relative;transition:transform 0.2s,box-shadow 0.2s;display:flex;flex-direction:column;gap:12px;}
  .service-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.1);}
  .svc-badge{position:absolute;top:16px;right:16px;background:var(--orange);color:#fff;font-size:9px;font-weight:700;padding:3px 8px;border-radius:999px;text-transform:uppercase;}
  .svc-icon{font-size:40px;}
  .service-card h3{font-size:17px;font-weight:700;color:var(--navy);}
  .service-card p{color:var(--text);font-size:14px;line-height:1.7;flex:1;}
  .svc-btn{background:transparent;border:1.5px solid var(--orange);color:var(--orange);border-radius:8px;padding:9px 16px;font-size:12px;font-weight:700;transition:all 0.15s;width:fit-content;}
  .svc-btn:hover{background:var(--orange);color:#fff;}
  @media(max-width:900px){.services-grid{grid-template-columns:1fr 1fr;}}
  @media(max-width:600px){.services-grid{grid-template-columns:1fr;}}

  /* WORKFLOW */
  .workflow-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;position:relative;}
  .workflow-grid::before{content:'';position:absolute;top:36px;left:10%;right:10%;height:2px;background:linear-gradient(90deg,var(--orange),var(--orange-dark));z-index:0;}
  .wf-step{text-align:center;position:relative;z-index:1;}
  .wf-num{width:72px;height:72px;background:var(--orange);color:#fff;font-size:22px;font-weight:900;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;box-shadow:0 4px 16px rgba(249,115,22,.4);}
  .wf-step h3{font-size:16px;font-weight:700;color:var(--navy);margin-bottom:8px;}
  .wf-step p{font-size:13px;color:var(--text-light);line-height:1.7;}
  @media(max-width:800px){.workflow-grid{grid-template-columns:1fr 1fr;}.workflow-grid::before{display:none;}}
  @media(max-width:500px){.workflow-grid{grid-template-columns:1fr;}}

  /* GALLERY */
  .gallery-empty{text-align:center;color:var(--text-light);padding:40px;background:#f9fafb;border-radius:12px;border:2px dashed var(--border);}

  /* TESTIMONIALS */
  .testi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;}
  .testi-card{background:#fff;border-radius:16px;padding:28px;border:1px solid var(--border);display:flex;flex-direction:column;gap:14px;transition:box-shadow 0.2s;}
  .testi-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.08);}
  .testi-stars{font-size:18px;}
  .testi-card > p{color:var(--text);font-size:14px;line-height:1.8;flex:1;font-style:italic;}
  .testi-author{display:flex;align-items:center;gap:12px;}
  .testi-avatar{width:44px;height:44px;border-radius:50%;background:var(--orange);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;flex-shrink:0;}
  .testi-author strong{display:block;font-size:14px;color:var(--navy);}
  .testi-author span{font-size:12px;color:var(--text-light);}
  @media(max-width:700px){.testi-grid{grid-template-columns:1fr;}}

  /* CTA */
  .cta-strip{background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:64px 0;}
  .cta-inner{display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap;}
  .cta-text h2{font-size:28px;font-weight:800;color:#fff;margin-bottom:8px;}
  .cta-text p{color:#94a3b8;font-size:15px;}
  .cta-actions{display:flex;gap:14px;flex-wrap:wrap;}
  .cta-wa{display:flex;align-items:center;gap:8px;background:var(--wa-green);color:#fff;border:none;border-radius:10px;padding:13px 22px;font-size:15px;font-weight:700;transition:background 0.15s;}
  .cta-wa:hover{background:var(--wa-dark);}
  .cta-email{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);color:#e2e8f0;border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:13px 22px;font-size:15px;font-weight:600;transition:background 0.15s;}
  .cta-email:hover{background:rgba(255,255,255,.2);}

  /* CONTACT */
  .contact-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:48px;}
  .contact-info{display:flex;flex-direction:column;gap:24px;}
  .ci-item{display:flex;gap:14px;align-items:flex-start;}
  .ci-icon{font-size:24px;flex-shrink:0;width:44px;height:44px;background:var(--orange-light);border-radius:10px;display:flex;align-items:center;justify-content:center;}
  .ci-item strong{font-size:14px;color:var(--navy);display:block;margin-bottom:4px;}
  .ci-item p{font-size:13px;color:var(--text-light);line-height:1.6;}
  .contact-wa-btn{margin-top:8px;background:var(--wa-green);color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:13px;font-weight:700;}
  .contact-wa-btn:hover{background:var(--wa-dark);}
  .ci-item a{color:var(--orange);}
  .contact-form-wrap{background:#fff;border-radius:20px;padding:32px;border:1px solid var(--border);}
  .contact-form-wrap h3{font-size:20px;font-weight:800;color:var(--navy);margin-bottom:24px;}
  .contact-form{display:flex;flex-direction:column;gap:14px;}
  .cf-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .cf-group{display:flex;flex-direction:column;gap:5px;}
  .cf-group label{font-size:12px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.04em;}
  .cf-group input,.cf-group select,.cf-group textarea{border:1.5px solid var(--border);border-radius:9px;padding:10px 14px;font-size:13px;outline:none;transition:border-color 0.15s;}
  .cf-group input:focus,.cf-group select:focus,.cf-group textarea:focus{border-color:var(--orange);}
  .cf-group textarea{resize:vertical;}
  .cf-submit{display:flex;align-items:center;justify-content:center;gap:8px;background:var(--wa-green);color:#fff;border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:700;transition:background 0.15s;}
  .cf-submit:hover{background:var(--wa-dark);}
  @media(max-width:900px){.contact-grid{grid-template-columns:1fr;}}
  @media(max-width:600px){.cf-row{grid-template-columns:1fr;}}

  /* FOOTER */
  .footer{background:var(--navy);color:#94a3b8;padding:64px 0 0;}
  .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;padding-bottom:48px;border-bottom:1px solid #1e293b;}
  .footer-logo{font-size:20px;font-weight:800;color:#fff;margin-bottom:12px;}
  .footer-brand p{font-size:13px;line-height:1.8;margin-bottom:16px;}
  .footer-wa{display:flex;align-items:center;gap:8px;background:var(--wa-green);color:#fff;border:none;border-radius:9px;padding:10px 16px;font-size:13px;font-weight:700;width:fit-content;}
  .footer-col h4{color:#fff;font-size:14px;font-weight:700;margin-bottom:14px;}
  .footer-col ul{list-style:none;display:flex;flex-direction:column;gap:8px;}
  .footer-col ul li{font-size:13px;line-height:1.5;}
  .footer-bottom{padding:20px 0;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:12px;}
  .footer-bottom strong{color:#f97316;}
  @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr;}}
  @media(max-width:600px){.footer-grid{grid-template-columns:1fr;}}
</style>
