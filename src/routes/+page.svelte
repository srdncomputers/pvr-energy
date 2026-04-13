<script>
  import { onMount } from 'svelte';

  let galleryImages = [
    { id:1, url:'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80', caption:'Rooftop Solar — Electronic City' },
    { id:2, url:'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80', caption:'Residential Installation — Anekal' },
    { id:3, url:'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&q=80', caption:'Commercial Solar — Attibele' },
    { id:4, url:'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80', caption:'Solar Farm — Bangalore Rural' },
    { id:5, url:'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80', caption:'Solar Panel Installation' },
    { id:6, url:'https://images.unsplash.com/photo-1548425279-81d7f44f8ad6?w=800&q=80', caption:'Water Heater System' },
  ];

  let showAdmin = false;
  let adminPass = '';
  let adminLoggedIn = false;
  let newCaption = '';
  let newUrl = '';
  let mobileMenuOpen = false;
  let activeSection = 'home';
  let lightboxImg = null;

  const ADMIN_PASSWORD = 'pvr2025';
  const WHATSAPP_NUMBER = '919036099917';

  function adminLogin() {
    if (adminPass === ADMIN_PASSWORD) { adminLoggedIn = true; adminPass = ''; }
    else { alert('Wrong password'); }
  }
  function addImage() {
    if (!newUrl.trim()) return;
    galleryImages = [...galleryImages, { id: Date.now(), url: newUrl.trim(), caption: newCaption.trim() || 'PVR Energy Project' }];
    newUrl = ''; newCaption = '';
  }
  function removeImage(id) { galleryImages = galleryImages.filter(i => i.id !== id); }
  function handleFileUpload(e) {
    const files = e.target.files;
    if (!files) return;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        galleryImages = [...galleryImages, { id: Date.now() + Math.random(), url: ev.target.result, caption: file.name.replace(/\.[^.]+$/, '') }];
      };
      reader.readAsDataURL(file);
    }
  }
  function whatsapp(msg = '') {
    const text = encodeURIComponent(msg || 'Hello PVR Energy Solutions! I am interested in solar installation for my property in Bangalore.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  }
  function scrollTo(id) {
    mobileMenuOpen = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) activeSection = e.target.id; }
    }, { threshold: 0.3 });
    ['home','about','services','gallery','testimonials','contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  });

  const services = [
    { icon:'☀️', title:'Rooftop Solar Installation', desc:'Efficient solar systems for homes and businesses across Bangalore. We handle everything from Anekal to Electronic City — site survey, design, installation and commissioning.', badge:'Most Popular' },
    { icon:'🏠', title:'Residential Solar Solutions', desc:'Help your family go solar with customised residential systems. Save ₹2,000–₹8,000 on monthly electricity bills. Ideal for homes in Attibele, Jigani & surrounding areas.', badge:'' },
    { icon:'🏭', title:'Commercial Solar Systems', desc:"Large-scale solar installations for factories, warehouses, IT parks and offices. Achieve energy independence and reduce operational costs significantly.", badge:'' },
    { icon:'🚿', title:'Solar Water Heaters', desc:'Eco-friendly solar water heating for homes and apartments. Consistent hot water supply throughout the year at minimal running cost.', badge:'' },
    { icon:'💧', title:'Water Softeners & Purifiers', desc:"Advanced water treatment systems that tackle Bangalore's hard water problem. Protect your appliances, pipes and health with our certified systems.", badge:'Bangalore Special' },
    { icon:'🔋', title:'UPS & Power Backup', desc:'Reliable UPS and power backup solutions to keep your home or office running during frequent power cuts in Bangalore outskirts.', badge:'' },
  ];
  const workflow = [
    { num:'01', title:'Free Site Visit', desc:'Our expert visits your property in Bangalore, inspects the rooftop, measures shadow-free area, and analyses your electricity bill to size the right system.' },
    { num:'02', title:'Custom Design & Quote', desc:'We prepare a detailed proposal with system capacity, panel layout, expected generation, ROI and estimated payback period — all transparent and jargon-free.' },
    { num:'03', title:'Professional Installation', desc:'Certified technicians install premium panels and equipment. We handle BESCOM/BMRDA approvals, net metering and all documentation.' },
    { num:'04', title:'Handover & Support', desc:'System testing, commissioning, and a comprehensive handover. Ongoing maintenance, remote monitoring and dedicated WhatsApp support.' },
  ];
  const testimonials = [
    { name:'Manjunath R.', location:'Anekal, Bangalore', text:'Got a water de-scaler installed for our home. The water quality has improved remarkably and maintenance has reduced. Highly recommended!', stars:5 },
    { name:'Sandeep Shetty', location:'Electronic City Phase 2', text:'PVR Energy helped with solar installation for our shop. They explained everything clearly, completed on time, and delivered exactly as promised.', stars:5 },
    { name:'Ravi Kumar S.', location:'Electronic City, Bangalore', text:'Installed a 5kW solar rooftop for our office. Professional team, smooth process — already seeing a 60% drop in electricity bills. Excellent!', stars:5 },
    { name:'Priya N.', location:'Attibele, Bangalore', text:'Very happy with their UPS solution. Power cuts were a big issue in Attibele, but now everything runs smoothly. Quick installation and great support.', stars:5 },
  ];
  const stats = [
    { num:'50+', label:'Projects Completed' },
    { num:'3+', label:'Years in Bangalore' },
    { num:'15+', label:'Expert Technicians' },
    { num:'100%', label:'Customer Satisfaction' },
  ];
</script>

<svelte:head>
  <title>PVR Energy Solutions — Solar Installation Bangalore | Electronic City | Anekal | Attibele</title>
  <meta name="description" content="Bangalore's trusted solar installation company. Serving Electronic City, Anekal, Attibele, Jigani. BESCOM approved. Free site visit. WhatsApp: 9036099917" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Noto+Sans+Kannada:wght@400;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<!-- WHATSAPP FLOAT -->
<button class="wa-float" on:click={() => whatsapp()} title="Chat on WhatsApp">
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  <span>Chat with Us</span>
</button>

<!-- TOPBAR -->
<div class="topbar">
  <div class="topbar-inner">
    <div class="topbar-left">
      <a href="mailto:info@pvrenergysolutions.in" class="topbar-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        info@pvrenergysolutions.in
      </a>
      <span class="topbar-sep">|</span>
      <span class="topbar-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        Bangalore, Karnataka
      </span>
    </div>
    <div class="topbar-right">
      <button class="topbar-wa" on:click={() => whatsapp()}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        +91 90360 99917
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
        <div class="logo-name">PVR Energy</div>
        <div class="logo-sub">Solutions</div>
      </div>
    </div>
    <div class="nav-links">
      {#each [['home','Home'],['about','About'],['services','Services'],['gallery','Gallery'],['testimonials','Reviews'],['contact','Contact']] as [id, label]}
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
      {#each [['home','Home'],['about','About'],['services','Services'],['gallery','Gallery'],['testimonials','Reviews'],['contact','Contact']] as [id, label]}
        <button class="mobile-link" on:click={() => scrollTo(id)}>{label}</button>
      {/each}
      <button class="mobile-quote" on:click={() => whatsapp()}>📱 WhatsApp Us Now</button>
    </div>
  {/if}
</nav>

<!-- ADMIN PANEL -->
{#if showAdmin}
  <div class="admin-overlay" on:click={() => showAdmin = false}>
    <div class="admin-panel" on:click|stopPropagation>
      <div class="admin-hdr">
        <h3>🔧 Admin — Photo Gallery</h3>
        <button on:click={() => { showAdmin = false; adminLoggedIn = false; }}>✕</button>
      </div>
      {#if !adminLoggedIn}
        <div class="admin-login">
          <p>Enter admin password to manage gallery photos</p>
          <input type="password" bind:value={adminPass} placeholder="Password" on:keydown={(e) => e.key === 'Enter' && adminLogin()}/>
          <button on:click={adminLogin}>Login</button>
        </div>
      {:else}
        <div class="admin-body">
          <div class="admin-upload-section">
            <h4>Upload Photos from Device</h4>
            <label class="upload-btn">📁 Choose Photos<input type="file" accept="image/*" multiple on:change={handleFileUpload} style="display:none"/></label>
          </div>
          <div class="admin-url-section">
            <h4>Add Photo by URL</h4>
            <input bind:value={newUrl} placeholder="https://... image URL"/>
            <input bind:value={newCaption} placeholder="Caption (e.g. Solar project in Anekal)"/>
            <button on:click={addImage}>Add Photo</button>
          </div>
          <div class="admin-grid">
            <h4>Current Gallery ({galleryImages.length} photos)</h4>
            <div class="admin-imgs">
              {#each galleryImages as img (img.id)}
                <div class="admin-img-card">
                  <img src={img.url} alt={img.caption}/>
                  <p>{img.caption}</p>
                  <button on:click={() => removeImage(img.id)}>🗑 Remove</button>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- ══ HERO ══════════════════════════════════════════════ -->
<section id="home" class="hero">
  <div class="hero-bg"></div>

  <div class="hero-row">

    <!-- LEFT: English -->
    <div class="hero-content">
      <div class="hero-badge">🌞 Bangalore's Trusted Solar Partner</div>
      <h1>Power Your Home<br/>with Clean Solar Energy</h1>
      <p>Serving Electronic City · Anekal · Attibele · Jigani · Bangalore Rural</p>
      <div class="hero-actions">
        <button class="hero-btn primary" on:click={() => whatsapp('Hi! I want a FREE solar site visit for my property.')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Book Free Site Visit
        </button>
        <button class="hero-btn secondary" on:click={() => scrollTo('services')}>Our Services</button>
      </div>
      <div class="hero-tags">
        <span>✅ BESCOM Approved</span>
        <span>✅ Subsidy Assistance</span>
        <span>✅ 25 Year Panel Warranty</span>
        <span>✅ Free Consultation</span>
      </div>
    </div>

    <!-- RIGHT: Kannada card -->
    <div class="hero-kannada">
      <div class="kn-card">
        <div class="kn-sun">☀️</div>
        <h2 class="kn-title">ನಿಮ್ಮ ಮನೆಗೆ<br/>ಸೌರ ಶಕ್ತಿ ತನ್ನಿ</h2>
        <p class="kn-sub">ಸ್ವಚ್ಛ ಮತ್ತು ಉಳಿತಾಯದ ವಿದ್ಯುತ್</p>
        <div class="kn-divider"></div>
        <ul class="kn-points">
          <li><span class="kn-dot"></span>ಉಚಿತ ಸೈಟ್ ಭೇಟಿ ಮತ್ತು ಅಂದಾಜು</li>
          <li><span class="kn-dot"></span>BESCOM ಅನುಮೋದಿತ ಸ್ಥಾಪನೆ</li>
          <li><span class="kn-dot"></span>ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಸಹಾಯ</li>
          <li><span class="kn-dot"></span>ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ · ಆನೇಕಲ್ · ಅತ್ತಿಬೆಲೆ</li>
        </ul>
        <button class="kn-btn" on:click={() => whatsapp('ನಮಸ್ಕಾರ! ನಾನು ಸೌರ ಶಕ್ತಿ ಅಳವಡಿಕೆ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು.')}>
          ಇಂದೇ ಸಂಪರ್ಕಿಸಿ →
        </button>
        <p class="kn-number">📱 90360 99917</p>
      </div>
    </div>

  </div>

  <div class="hero-stats">
    {#each stats as s}
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
        <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=700&q=80" alt="PVR Energy Solutions team Bangalore" class="about-img"/>
        <div class="about-img-badge"><div class="aib-num">3+</div><div class="aib-label">Years Serving<br/>Bangalore</div></div>
      </div>
      <div class="about-content">
        <div class="section-tag">🏙️ About Us</div>
        <h2>Bangalore's Local<br/>Solar Energy Experts</h2>
        <p>PVR Energy Solutions is a Bangalore-based company committed to helping homes, businesses, and industries in South Bangalore transition to clean, reliable and cost-efficient solar energy.</p>
        <p>We specialise in solar rooftop installations across <strong>Electronic City, Anekal, Attibele, Jigani, Hosa Road</strong> and the Bangalore Rural district.</p>
        <p>Our team handles everything: BESCOM net-metering approvals, Karnataka government subsidy applications, structural survey, premium panel sourcing and post-installation AMC support.</p>
        <div class="about-highlights">
          <div class="ah-item"><span class="ah-icon">🏆</span><div><strong>BESCOM Empanelled</strong><br/><small>Approved vendor for net metering</small></div></div>
          <div class="ah-item"><span class="ah-icon">💰</span><div><strong>Subsidy Assistance</strong><br/><small>PM Surya Ghar &amp; State schemes</small></div></div>
          <div class="ah-item"><span class="ah-icon">🔧</span><div><strong>End-to-End Service</strong><br/><small>Survey → Install → AMC</small></div></div>
          <div class="ah-item"><span class="ah-icon">📍</span><div><strong>Local Team</strong><br/><small>Based in South Bangalore</small></div></div>
        </div>
        <button class="btn-primary" on:click={() => whatsapp('Hi! I want to know more about PVR Energy Solutions.')}>Talk to Our Team →</button>
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
      {#each services as svc}
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
      {#each workflow as step}
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
    <div class="gallery-grid">
      {#each galleryImages as img (img.id)}
        <div class="gallery-card" on:click={() => lightboxImg = img}>
          <img src={img.url} alt={img.caption} loading="lazy"/>
          <div class="gallery-overlay"><p>{img.caption}</p><span>🔍 View</span></div>
        </div>
      {/each}
    </div>
    {#if galleryImages.length === 0}
      <div class="gallery-empty">No photos yet. Admin can add photos using the ⚙ button.</div>
    {/if}
  </div>
</section>

{#if lightboxImg}
  <div class="lightbox" on:click={() => lightboxImg = null}>
    <button class="lightbox-close" on:click={() => lightboxImg = null}>✕</button>
    <img src={lightboxImg.url} alt={lightboxImg.caption}/>
    <p>{lightboxImg.caption}</p>
  </div>
{/if}

<!-- TESTIMONIALS -->
<section id="testimonials" class="testimonials section">
  <div class="container">
    <div class="section-header">
      <div class="section-tag">⭐ Customer Reviews</div>
      <h2>What Bangalore Customers Say</h2>
      <p>Trusted by homeowners and businesses across South Bangalore</p>
    </div>
    <div class="testi-grid">
      {#each testimonials as t}
        <div class="testi-card">
          <div class="testi-stars">{'⭐'.repeat(t.stars)}</div>
          <p>"{t.text}"</p>
          <div class="testi-author">
            <div class="testi-avatar">{t.name[0]}</div>
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
        <button class="cta-wa" on:click={() => whatsapp('Hi PVR Energy! I want a FREE solar consultation.')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp: +91 90360 99917
        </button>
        <a href="mailto:info@pvrenergysolutions.in" class="cta-email">📧 info@pvrenergysolutions.in</a>
      </div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact" class="contact section">
  <div class="container">
    <div class="section-header">
      <div class="section-tag">📞 Get In Touch</div>
      <h2>Contact PVR Energy Solutions</h2>
      <p>Reach us on WhatsApp, email or visit us in Bangalore</p>
    </div>
    <div class="contact-grid">
      <div class="contact-info">
        <div class="ci-item">
          <div class="ci-icon">📍</div>
          <div><strong>Service Area</strong><p>Bangalore, Karnataka — 560100<br/>Serving: Electronic City, Anekal, Attibele, Jigani, Hosa Road</p></div>
        </div>
        <div class="ci-item">
          <div class="ci-icon">📱</div>
          <div><strong>WhatsApp / Call</strong><p>+91 90360 99917</p><button class="contact-wa-btn" on:click={() => whatsapp()}>Open WhatsApp Chat</button></div>
        </div>
        <div class="ci-item">
          <div class="ci-icon">📧</div>
          <div><strong>Email</strong><p><a href="mailto:info@pvrenergysolutions.in">info@pvrenergysolutions.in</a></p></div>
        </div>
        <div class="ci-item">
          <div class="ci-icon">🕐</div>
          <div><strong>Working Hours</strong><p>Monday – Saturday: 9:00 AM – 6:00 PM<br/>Sunday: On appointment only</p></div>
        </div>
      </div>
      <div class="contact-form-wrap">
        <h3>Send us a Message</h3>
        <form class="contact-form" on:submit|preventDefault={(e) => { const fd = new FormData(e.target); whatsapp(`Name: ${fd.get('name')}\nPhone: ${fd.get('phone')}\nMessage: ${fd.get('message')}`); }}>
          <div class="cf-row">
            <div class="cf-group"><label for="name">Your Name *</label><input id="name" name="name" required placeholder="e.g. Rajesh Kumar"/></div>
            <div class="cf-group"><label for="phone">Phone Number *</label><input id="phone" name="phone" required placeholder="+91 98XXX XXXXX"/></div>
          </div>
          <div class="cf-group"><label for="location">Property Location</label><input id="location" name="location" placeholder="e.g. Electronic City Phase 1"/></div>
          <div class="cf-group">
            <label for="service">Service Required</label>
            <select id="service" name="service">
              <option>Rooftop Solar Installation</option><option>Residential Solar</option>
              <option>Commercial Solar</option><option>Solar Water Heater</option>
              <option>Water Softener</option><option>UPS / Power Backup</option>
            </select>
          </div>
          <div class="cf-group"><label for="message">Message</label><textarea id="message" name="message" rows="4" placeholder="Tell us about your property, electricity bill amount, rooftop size..."></textarea></div>
          <button type="submit" class="cf-submit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
        <div class="footer-logo">☀️ PVR Energy Solutions</div>
        <p>Bangalore's trusted solar installation company. Serving Electronic City, Anekal, Attibele, Jigani and surrounding areas since 2022.</p>
        <button class="footer-wa" on:click={() => whatsapp()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          +91 90360 99917
        </button>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul>
          <li>Rooftop Solar Installation</li><li>Residential Solar Systems</li>
          <li>Commercial Solar Solutions</li><li>Solar Water Heaters</li>
          <li>Water Softeners</li><li>UPS &amp; Power Backup</li>
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
          <li>📱 +91 90360 99917</li>
          <li>📧 info@pvrenergysolutions.in</li>
          <li>📍 Bangalore, Karnataka</li>
          <li>🕐 Mon–Sat: 9AM–6PM</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 PVR Energy Solutions. All rights reserved. | Bangalore, Karnataka</p>
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

  /* ADMIN */
  .admin-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;}
  .admin-panel{background:#fff;border-radius:16px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.25);}
  .admin-hdr{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border);}
  .admin-hdr h3{font-size:16px;font-weight:700;color:var(--navy);}
  .admin-hdr button{background:none;border:none;font-size:20px;color:#9ca3af;}
  .admin-login{padding:28px 22px;display:flex;flex-direction:column;gap:12px;}
  .admin-login p{color:var(--text-light);font-size:14px;}
  .admin-login input{border:1.5px solid var(--border);border-radius:8px;padding:10px 14px;font-size:14px;outline:none;}
  .admin-login button{background:var(--orange);color:#fff;border:none;border-radius:8px;padding:10px;font-weight:700;}
  .admin-body{padding:22px;display:flex;flex-direction:column;gap:20px;}
  .admin-body h4{font-size:13px;font-weight:700;color:var(--navy);margin-bottom:8px;}
  .admin-upload-section,.admin-url-section{display:flex;flex-direction:column;gap:8px;}
  .upload-btn{display:inline-flex;align-items:center;gap:6px;background:var(--orange);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:600;font-size:13px;cursor:pointer;width:fit-content;}
  .admin-url-section input{border:1.5px solid var(--border);border-radius:8px;padding:9px 12px;font-size:13px;outline:none;}
  .admin-url-section button{background:var(--green);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-weight:700;font-size:13px;width:fit-content;}
  .admin-imgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:8px;}
  .admin-img-card{border:1px solid var(--border);border-radius:8px;overflow:hidden;display:flex;flex-direction:column;}
  .admin-img-card img{width:100%;height:100px;object-fit:cover;}
  .admin-img-card p{font-size:10px;padding:5px 8px;color:var(--text-light);flex:1;}
  .admin-img-card button{background:#fef2f2;color:#dc2626;border:none;padding:5px;font-size:11px;font-weight:600;cursor:pointer;}

  /* ══ HERO ═══════════════════════════════════════════════ */
  .hero{
    min-height:calc(100vh - 107px);
    background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#164e35 100%);
    position:relative;display:flex;flex-direction:column;
    justify-content:center;padding:80px 20px 40px;color:#fff;
  }
  .hero-bg{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1400&q=60') center/cover no-repeat;opacity:.18;}

  /* Two-column row */
  .hero-row{
    position:relative;max-width:1200px;margin:0 auto;width:100%;
    display:grid;grid-template-columns:1fr 420px;gap:48px;align-items:center;
  }

  /* Left: English content */
  .hero-content{}
  .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(249,115,22,.2);border:1px solid rgba(249,115,22,.4);color:#fed7aa;font-size:13px;font-weight:600;padding:6px 14px;border-radius:999px;margin-bottom:20px;}
  .hero-content h1{font-size:clamp(32px,5vw,58px);font-weight:900;line-height:1.1;margin-bottom:16px;text-shadow:0 2px 20px rgba(0,0,0,.3);}
  .hero-content > p{font-size:16px;color:#cbd5e1;margin-bottom:32px;}
  .hero-actions{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:32px;}
  .hero-btn{display:flex;align-items:center;gap:8px;border:none;border-radius:12px;padding:14px 26px;font-size:15px;font-weight:700;transition:all 0.2s;}
  .hero-btn.primary{background:var(--wa-green);color:#fff;box-shadow:0 4px 20px rgba(37,211,102,.4);}
  .hero-btn.primary:hover{background:var(--wa-dark);transform:translateY(-2px);}
  .hero-btn.secondary{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.3);}
  .hero-btn.secondary:hover{background:rgba(255,255,255,.2);}
  .hero-tags{display:flex;gap:8px;flex-wrap:wrap;}
  .hero-tags span{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#e2e8f0;font-size:12px;font-weight:500;padding:4px 12px;border-radius:999px;}

  /* Right: Kannada card */
  .hero-kannada{display:flex;align-items:center;justify-content:center;}
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
    line-height:1.3;margin-bottom:8px;text-align:center;
    text-shadow:0 2px 12px rgba(0,0,0,.3);
  }
  .kn-sub{
    font-family:'Noto Sans Kannada','Poppins',sans-serif;
    font-size:14px;color:#fed7aa;text-align:center;font-weight:500;margin-bottom:16px;
  }
  .kn-divider{height:1px;background:rgba(255,255,255,.2);margin:16px 0;}
  .kn-points{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
  .kn-points li{
    display:flex;align-items:center;gap:10px;
    font-family:'Noto Sans Kannada','Poppins',sans-serif;
    font-size:13px;color:#e2e8f0;font-weight:500;
  }
  .kn-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px rgba(74,222,128,.7);flex-shrink:0;}
  .kn-btn{
    width:100%;background:var(--orange);color:#fff;border:none;
    border-radius:10px;padding:12px;
    font-family:'Noto Sans Kannada','Poppins',sans-serif;
    font-size:15px;font-weight:700;
    transition:background 0.15s,transform 0.15s;
    margin-bottom:12px;
    box-shadow:0 4px 16px rgba(249,115,22,.4);
  }
  .kn-btn:hover{background:var(--orange-dark);transform:translateY(-1px);}
  .kn-number{
    font-family:'Poppins',sans-serif;
    text-align:center;color:#94a3b8;font-size:13px;
  }

  /* Stats row */
  .hero-stats{position:relative;max-width:1200px;margin:40px auto 0;width:100%;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.1);border-radius:16px;overflow:hidden;}
  .hero-stat{background:rgba(0,0,0,.2);backdrop-filter:blur(10px);padding:24px;text-align:center;}
  .hs-num{font-size:36px;font-weight:900;color:var(--orange);}
  .hs-label{font-size:13px;color:#94a3b8;font-weight:500;}

  @media(max-width:960px){
    .hero-row{grid-template-columns:1fr;gap:32px;}
    .hero-kannada{max-width:480px;width:100%;}
  }
  @media(max-width:700px){.hero-stats{grid-template-columns:1fr 1fr;}}

  /* ABOUT */
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
  .about-img-wrap{position:relative;}
  .about-img{width:100%;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.15);object-fit:cover;height:480px;}
  .about-img-badge{position:absolute;bottom:-20px;right:-20px;background:var(--orange);color:#fff;border-radius:16px;padding:20px 24px;text-align:center;box-shadow:0 8px 24px rgba(249,115,22,.4);}
  .aib-num{font-size:40px;font-weight:900;line-height:1;}
  .aib-label{font-size:12px;font-weight:600;line-height:1.4;}
  .about-content{display:flex;flex-direction:column;gap:16px;}
  .about-content h2{font-size:clamp(26px,4vw,38px);font-weight:800;color:var(--navy);line-height:1.2;}
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
  .gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
  .gallery-card{border-radius:14px;overflow:hidden;cursor:pointer;position:relative;aspect-ratio:4/3;}
  .gallery-card img{width:100%;height:100%;object-fit:cover;transition:transform 0.3s;}
  .gallery-card:hover img{transform:scale(1.07);}
  .gallery-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.8) 0%,transparent 60%);opacity:0;transition:opacity 0.3s;display:flex;flex-direction:column;justify-content:flex-end;padding:16px;}
  .gallery-card:hover .gallery-overlay{opacity:1;}
  .gallery-overlay p{color:#fff;font-size:13px;font-weight:600;}
  .gallery-overlay span{color:#fbbf24;font-size:12px;}
  .gallery-empty{text-align:center;color:var(--text-light);padding:40px;background:#f9fafb;border-radius:12px;border:2px dashed var(--border);}
  @media(max-width:700px){.gallery-grid{grid-template-columns:1fr 1fr;}}
  @media(max-width:480px){.gallery-grid{grid-template-columns:1fr;}}
  .lightbox{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:600;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;cursor:pointer;}
  .lightbox img{max-width:90vw;max-height:80vh;object-fit:contain;border-radius:12px;}
  .lightbox p{color:#fff;margin-top:14px;font-size:14px;}
  .lightbox-close{position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;}

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
