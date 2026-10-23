<script>
  import { createEventDispatcher } from 'svelte';
  import ImageField from '$lib/ImageField.svelte';

  const dispatch = createEventDispatcher();

  let pass = '';
  let loggedIn = false;
  let loginError = '';
  let loggingIn = false;

  let tab = 'gallery';
  const tabs = [
    ['gallery', '🖼 Gallery'],
    ['hero', '🌅 Home Banner'],
    ['about', '🏢 About'],
    ['services', '⚡ Services'],
    ['reviews', '⭐ Reviews'],
    ['contact', '📞 Contact & Footer']
  ];

  // ── Site content (everything except gallery photos) ──
  let draft = null;
  let snapshot = '';
  let saving = false;
  let saveMsg = '';
  $: dirty = draft ? JSON.stringify(draft) !== snapshot : false;
  $: if (dirty) saveMsg = '';

  // ── Gallery photos ──
  let photos = [];
  let newCaption = '';
  let newUrl = '';
  let newKind = 'gallery';
  let uploading = false;

  const H = () => ({ 'x-admin-password': pass });
  const HJ = () => ({ 'content-type': 'application/json', 'x-admin-password': pass });

  async function login() {
    loginError = '';
    loggingIn = true;
    try {
      const res = await fetch('/api/admin/content', { headers: H() });
      if (!res.ok) {
        loginError = 'Wrong password';
      } else {
        draft = await res.json();
        snapshot = JSON.stringify(draft);
        await loadPhotos();
        loggedIn = true;
      }
    } catch {
      loginError = 'Could not reach the server. Try again.';
    }
    loggingIn = false;
  }

  function close() {
    if (dirty && !confirm('You have unsaved changes. Close without saving?')) return;
    dispatch('close');
  }

  async function save() {
    saving = true;
    saveMsg = '';
    try {
      const res = await fetch('/api/admin/content', { method: 'PUT', headers: HJ(), body: JSON.stringify(draft) });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      draft = saved;
      snapshot = JSON.stringify(saved);
      dispatch('saved', saved);
      saveMsg = '✅ Saved — your website is updated';
    } catch {
      saveMsg = '❌ Could not save. Please try again.';
    }
    saving = false;
  }

  // ── list helpers ──
  function add(list, item) { list.push(item); draft = draft; }
  function remove(list, i) { list.splice(i, 1); draft = draft; }
  function move(list, i, d) {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    draft = draft;
  }

  // ── gallery ──
  async function loadPhotos() {
    const res = await fetch('/api/admin/images', { headers: H() });
    if (res.ok) photos = await res.json();
  }
  async function changed() {
    await loadPhotos();
    dispatch('gallery');
  }
  async function addByUrl() {
    if (!newUrl.trim()) return;
    await fetch('/api/admin/images', {
      method: 'POST',
      headers: HJ(),
      body: JSON.stringify({ url: newUrl.trim(), caption: newCaption.trim() || 'PVR Energy Project', kind: newKind })
    });
    newUrl = ''; newCaption = ''; newKind = 'gallery';
    await changed();
  }
  async function uploadPhotos(e) {
    const files = e.target.files;
    if (!files?.length) return;
    uploading = true;
    for (const file of files) {
      if (file.size > 4 * 1024 * 1024) { alert(`${file.name} is larger than 4 MB and was skipped.`); continue; }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('caption', newCaption.trim() || file.name.replace(/\.[^.]+$/, ''));
      fd.append('kind', newKind);
      await fetch('/api/admin/images', { method: 'POST', headers: H(), body: fd });
    }
    uploading = false;
    newCaption = ''; newKind = 'gallery';
    e.target.value = '';
    await changed();
  }
  async function patchPhoto(img, fields) {
    await fetch('/api/admin/images', { method: 'PATCH', headers: HJ(), body: JSON.stringify({ id: img.id, ...fields }) });
    await changed();
  }
  async function removePhoto(img) {
    if (!confirm('Remove this photo permanently?')) return;
    await fetch(`/api/admin/images?id=${img.id}`, { method: 'DELETE', headers: H() });
    await changed();
  }
</script>

<div class="ap-overlay" on:click={close}>
  <div class="ap" on:click|stopPropagation>
    <div class="ap-hdr">
      <h3>🔧 Website Admin</h3>
      <button class="ap-x" on:click={close} aria-label="Close">✕</button>
    </div>

    {#if !loggedIn}
      <div class="ap-login">
        <p>Enter the admin password to edit your website.</p>
        <input type="password" bind:value={pass} placeholder="Password" on:keydown={(e) => e.key === 'Enter' && login()} />
        <button class="ap-primary" on:click={login} disabled={loggingIn}>{loggingIn ? 'Checking…' : 'Login'}</button>
        {#if loginError}<p class="ap-err">{loginError}</p>{/if}
      </div>
    {:else}
      <div class="ap-tabs">
        {#each tabs as [id, label]}
          <button class="ap-tab" class:on={tab === id} on:click={() => (tab = id)}>{label}</button>
        {/each}
      </div>

      <div class="ap-body">
        <!-- ═════ GALLERY ═════ -->
        {#if tab === 'gallery'}
          <p class="ap-hint">Photos here appear in the <b>Project Gallery</b> carousel. Changes in this tab go live immediately.</p>
          <div class="ap-box">
            <h4>Add a new photo</h4>
            <div class="ap-row2">
              <input bind:value={newCaption} placeholder="Caption (e.g. Solar project in Anekal)" />
              <select bind:value={newKind}>
                <option value="gallery">Regular Work Photo</option>
                <option value="offer">🔥 Sale Offer</option>
              </select>
            </div>
            <label class="ap-primary ap-file">
              {uploading ? 'Uploading…' : '📁 Choose photos from device'}
              <input type="file" accept="image/*" multiple on:change={uploadPhotos} disabled={uploading} hidden />
            </label>
            <div class="ap-urlrow">
              <input bind:value={newUrl} placeholder="…or paste an image URL" />
              <button class="ap-green" on:click={addByUrl}>Add</button>
            </div>
          </div>

          <h4>Current photos ({photos.length})</h4>
          <div class="ap-photos">
            {#each photos as img (img.id)}
              <div class="ap-photo" class:hidden-photo={!img.published}>
                {#if img.kind === 'offer'}<span class="ap-offer">SALE OFFER</span>{/if}
                <img src={img.url} alt={img.caption} />
                <input
                  class="ap-cap"
                  value={img.caption}
                  on:change={(e) => patchPhoto(img, { caption: e.target.value })}
                  aria-label="Caption"
                />
                <div class="ap-photo-btns">
                  <button on:click={() => patchPhoto(img, { published: !img.published })}>{img.published ? '👁 Published' : '🚫 Hidden'}</button>
                  <button on:click={() => patchPhoto(img, { kind: img.kind === 'offer' ? 'gallery' : 'offer' })}>{img.kind === 'offer' ? 'Unmark Offer' : 'Mark as Offer'}</button>
                  <button class="ap-del" on:click={() => removePhoto(img)}>🗑 Remove</button>
                </div>
              </div>
            {/each}
          </div>

        <!-- ═════ HERO ═════ -->
        {:else if tab === 'hero'}
          <p class="ap-hint">The big sliding banner at the top of your website. Press <b>Enter</b> inside a title for a new line.</p>
          {#each draft.hero.slides as s, i}
            <div class="ap-box">
              <div class="ap-boxhdr">
                <h4>Slide {i + 1}</h4>
                <div class="ap-mini">
                  <button on:click={() => move(draft.hero.slides, i, -1)} disabled={i === 0}>↑</button>
                  <button on:click={() => move(draft.hero.slides, i, 1)} disabled={i === draft.hero.slides.length - 1}>↓</button>
                  <button class="ap-del" on:click={() => remove(draft.hero.slides, i)} disabled={draft.hero.slides.length <= 1}>Delete</button>
                </div>
              </div>
              <ImageField label="Background picture" bind:value={s.image} {pass} />
              <label>Small badge on top<input bind:value={s.tag} /></label>
              <label>Headline<textarea rows="2" bind:value={s.title}></textarea></label>
              <label>Text under headline<input bind:value={s.sub} /></label>
              <div class="ap-row2">
                <label>Bottom highlight number<input bind:value={s.bottomStat} /></label>
                <label>Bottom highlight text<input bind:value={s.bottomLabel} /></label>
              </div>
            </div>
          {/each}
          <button class="ap-add" on:click={() => add(draft.hero.slides, { image: '', tag: '', title: '', sub: '', bottomStat: '', bottomLabel: '' })}>＋ Add a slide</button>

          <div class="ap-box">
            <h4>Small tick badges (under the buttons)</h4>
            {#each draft.hero.tags as _, i}
              <div class="ap-urlrow">
                <input bind:value={draft.hero.tags[i]} />
                <button class="ap-del" on:click={() => remove(draft.hero.tags, i)}>✕</button>
              </div>
            {/each}
            <button class="ap-add" on:click={() => add(draft.hero.tags, '')}>＋ Add badge</button>
          </div>

          <div class="ap-box">
            <h4>Kannada card</h4>
            <label>Title<textarea rows="2" bind:value={draft.hero.kannada.title}></textarea></label>
            <label>Subtitle<input bind:value={draft.hero.kannada.sub} /></label>
            {#each draft.hero.kannada.points as _, i}
              <div class="ap-urlrow">
                <input bind:value={draft.hero.kannada.points[i]} />
                <button class="ap-del" on:click={() => remove(draft.hero.kannada.points, i)}>✕</button>
              </div>
            {/each}
            <button class="ap-add" on:click={() => add(draft.hero.kannada.points, '')}>＋ Add point</button>
            <label>Button text<input bind:value={draft.hero.kannada.button} /></label>
          </div>

          <div class="ap-box">
            <h4>Numbers strip (below the banner)</h4>
            {#each draft.stats as st, i}
              <div class="ap-urlrow">
                <input class="ap-narrow" bind:value={st.num} placeholder="50+" />
                <input bind:value={st.label} placeholder="Projects Completed" />
                <button class="ap-del" on:click={() => remove(draft.stats, i)}>✕</button>
              </div>
            {/each}
            <button class="ap-add" on:click={() => add(draft.stats, { num: '', label: '' })}>＋ Add number</button>
          </div>

        <!-- ═════ ABOUT ═════ -->
        {:else if tab === 'about'}
          <div class="ap-box">
            <ImageField label="About picture" bind:value={draft.about.image} {pass} />
            <div class="ap-row2">
              <label>Orange badge number<input bind:value={draft.about.badgeNum} /></label>
              <label>Orange badge text<textarea rows="2" bind:value={draft.about.badgeLabel}></textarea></label>
            </div>
            <label>Heading<textarea rows="2" bind:value={draft.about.title}></textarea></label>
          </div>
          <div class="ap-box">
            <h4>Paragraphs</h4>
            {#each draft.about.paragraphs as _, i}
              <div class="ap-urlrow top">
                <textarea rows="3" bind:value={draft.about.paragraphs[i]}></textarea>
                <button class="ap-del" on:click={() => remove(draft.about.paragraphs, i)}>✕</button>
              </div>
            {/each}
            <button class="ap-add" on:click={() => add(draft.about.paragraphs, '')}>＋ Add paragraph</button>
          </div>
          <div class="ap-box">
            <h4>Highlight boxes</h4>
            {#each draft.about.highlights as h, i}
              <div class="ap-urlrow">
                <input class="ap-narrow" bind:value={h.icon} placeholder="🏆" />
                <input bind:value={h.title} placeholder="Title" />
                <input bind:value={h.sub} placeholder="Small text" />
                <button class="ap-del" on:click={() => remove(draft.about.highlights, i)}>✕</button>
              </div>
            {/each}
            <button class="ap-add" on:click={() => add(draft.about.highlights, { icon: '✅', title: '', sub: '' })}>＋ Add box</button>
          </div>

        <!-- ═════ SERVICES ═════ -->
        {:else if tab === 'services'}
          <p class="ap-hint">The service cards, and the 4 “How We Work” steps further down.</p>
          {#each draft.services as sv, i}
            <div class="ap-box">
              <div class="ap-boxhdr">
                <h4>{sv.title || 'New service'}</h4>
                <div class="ap-mini">
                  <button on:click={() => move(draft.services, i, -1)} disabled={i === 0}>↑</button>
                  <button on:click={() => move(draft.services, i, 1)} disabled={i === draft.services.length - 1}>↓</button>
                  <button class="ap-del" on:click={() => remove(draft.services, i)}>Delete</button>
                </div>
              </div>
              <div class="ap-row3">
                <label>Icon<input class="ap-narrow" bind:value={sv.icon} /></label>
                <label>Title<input bind:value={sv.title} /></label>
                <label>Corner label (optional)<input bind:value={sv.badge} placeholder="Most Popular" /></label>
              </div>
              <label>Description<textarea rows="3" bind:value={sv.desc}></textarea></label>
            </div>
          {/each}
          <button class="ap-add" on:click={() => add(draft.services, { icon: '⚡', title: '', desc: '', badge: '' })}>＋ Add a service</button>

          <div class="ap-box">
            <h4>How We Work — steps</h4>
            {#each draft.workflow as w, i}
              <div class="ap-step">
                <div class="ap-urlrow">
                  <input class="ap-narrow" bind:value={w.num} />
                  <input bind:value={w.title} placeholder="Step title" />
                  <button class="ap-del" on:click={() => remove(draft.workflow, i)}>✕</button>
                </div>
                <textarea rows="2" bind:value={w.desc}></textarea>
              </div>
            {/each}
            <button class="ap-add" on:click={() => add(draft.workflow, { num: String(draft.workflow.length + 1).padStart(2, '0'), title: '', desc: '' })}>＋ Add step</button>
          </div>

        <!-- ═════ REVIEWS ═════ -->
        {:else if tab === 'reviews'}
          <p class="ap-hint">Customer reviews shown on the website. Only add real reviews from real customers.</p>
          {#each draft.testimonials as t, i}
            <div class="ap-box">
              <div class="ap-boxhdr">
                <h4>{t.name || 'New review'}</h4>
                <div class="ap-mini">
                  <button on:click={() => move(draft.testimonials, i, -1)} disabled={i === 0}>↑</button>
                  <button on:click={() => move(draft.testimonials, i, 1)} disabled={i === draft.testimonials.length - 1}>↓</button>
                  <button class="ap-del" on:click={() => remove(draft.testimonials, i)}>Delete</button>
                </div>
              </div>
              <div class="ap-row2">
                <label>Customer name<input bind:value={t.name} /></label>
                <label>Place<input bind:value={t.location} /></label>
              </div>
              <label>Review<textarea rows="3" bind:value={t.text}></textarea></label>
            </div>
          {/each}
          <button class="ap-add" on:click={() => add(draft.testimonials, { name: '', location: '', text: '' })}>＋ Add a review</button>

        <!-- ═════ CONTACT ═════ -->
        {:else if tab === 'contact'}
          <div class="ap-box">
            <h4>Business details</h4>
            <div class="ap-row2">
              <label>Company name<input bind:value={draft.business.name} /></label>
              <label>Small text under name<input bind:value={draft.business.tagline} /></label>
            </div>
            <div class="ap-row2">
              <label>WhatsApp number (with country code, digits only)<input bind:value={draft.business.whatsapp} placeholder="919036099917" /></label>
              <label>Phone as shown on site<input bind:value={draft.business.phoneDisplay} /></label>
            </div>
            <div class="ap-row2">
              <label>Email<input bind:value={draft.business.email} /></label>
              <label>Short location (top bar)<input bind:value={draft.business.location} /></label>
            </div>
            <label>Address (Contact section)<input bind:value={draft.business.address} /></label>
            <label>Areas served line<input bind:value={draft.business.serviceAreas} /></label>
            <label>Working hours (Contact section)<textarea rows="2" bind:value={draft.business.hours}></textarea></label>
            <label>Working hours (footer, short)<input bind:value={draft.business.footerHours} /></label>
            <label>Footer description<textarea rows="3" bind:value={draft.business.footerAbout}></textarea></label>
          </div>
        {/if}
      </div>

      {#if tab !== 'gallery'}
        <div class="ap-savebar">
          <span class="ap-savemsg">{saveMsg || (dirty ? 'You have unsaved changes' : 'No changes')}</span>
          <button class="ap-primary" on:click={save} disabled={saving || !dirty}>{saving ? 'Saving…' : '💾 Save changes'}</button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .ap-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .ap { background: #fff; border-radius: 16px; width: 100%; max-width: 880px; max-height: 92vh; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,.3); overflow: hidden; }
  .ap-hdr { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; border-bottom: 1px solid #e5e7eb; }
  .ap-hdr h3 { font-size: 16px; font-weight: 700; color: #0f172a; }
  .ap-x { background: none; border: none; font-size: 20px; color: #9ca3af; }
  .ap-login { padding: 28px 22px; display: flex; flex-direction: column; gap: 12px; }
  .ap-login p { color: #6b7280; font-size: 14px; }
  .ap-login input { border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 10px 14px; font-size: 14px; outline: none; }
  .ap-login .ap-err { color: #dc2626; font-size: 13px; }

  .ap-tabs { display: flex; gap: 4px; padding: 10px 14px 0; border-bottom: 1px solid #e5e7eb; overflow-x: auto; flex-shrink: 0; }
  .ap-tab { background: none; border: none; padding: 9px 14px; font-size: 13px; font-weight: 600; color: #6b7280; border-bottom: 3px solid transparent; white-space: nowrap; }
  .ap-tab.on { color: #f97316; border-bottom-color: #f97316; }
  .ap-body { padding: 18px 22px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; flex: 1; }
  .ap-hint { font-size: 13px; color: #6b7280; background: #f9fafb; border-radius: 8px; padding: 9px 12px; }
  .ap-body h4 { font-size: 13px; font-weight: 700; color: #0f172a; }

  .ap-box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
  .ap-boxhdr { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .ap-mini { display: flex; gap: 4px; }
  .ap-mini button { background: #f3f4f6; border: none; border-radius: 6px; padding: 4px 9px; font-size: 12px; font-weight: 600; color: #374151; }
  .ap-mini button:disabled { opacity: .35; }
  .ap-body label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 600; color: #6b7280; }
  .ap-body input, .ap-body textarea, .ap-body select { border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; font-size: 13px; outline: none; width: 100%; font-weight: 400; color: #111827; }
  .ap-body input:focus, .ap-body textarea:focus, .ap-body select:focus { border-color: #f97316; }
  .ap-body textarea { resize: vertical; }
  .ap-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .ap-row3 { display: grid; grid-template-columns: 80px 1fr 1fr; gap: 10px; }
  .ap-urlrow { display: flex; gap: 8px; align-items: center; }
  .ap-urlrow.top { align-items: flex-start; }
  .ap-body .ap-narrow { max-width: 80px; }
  .ap-step { display: flex; flex-direction: column; gap: 6px; padding-bottom: 8px; border-bottom: 1px dashed #e5e7eb; }

  .ap-primary { background: #f97316; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 700; width: fit-content; }
  .ap-primary:disabled { opacity: .5; cursor: not-allowed; }
  .ap-body label.ap-file { display: inline-block; flex-direction: row; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; }
  .ap-green { background: #16a34a; color: #fff; border: none; border-radius: 8px; padding: 9px 18px; font-weight: 700; font-size: 13px; }
  .ap-add { align-self: flex-start; background: #fff7ed; color: #ea580c; border: 1.5px dashed #fdba74; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 700; }
  .ap-body .ap-del, .ap-mini .ap-del { background: #fef2f2; color: #dc2626; border: none; border-radius: 6px; padding: 6px 10px; font-size: 12px; font-weight: 600; }

  .ap-savebar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 22px; border-top: 1px solid #e5e7eb; background: #fff; flex-shrink: 0; }
  .ap-savemsg { font-size: 13px; color: #6b7280; }

  .ap-photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; }
  .ap-photo { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; position: relative; }
  .ap-photo.hidden-photo img { opacity: .45; }
  .ap-photo img { width: 100%; height: 110px; object-fit: cover; }
  .ap-offer { position: absolute; top: 6px; left: 6px; background: #ef4444; color: #fff; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 999px; z-index: 1; }
  .ap-body .ap-cap { border: none; border-bottom: 1px solid #f3f4f6; border-radius: 0; font-size: 12px; }
  .ap-photo-btns { display: flex; flex-direction: column; gap: 3px; padding: 6px; }
  .ap-photo-btns button { background: #f3f4f6; border: none; border-radius: 5px; padding: 5px; font-size: 11px; font-weight: 600; color: #374151; }
  .ap-photo-btns button.ap-del { background: #fef2f2; color: #dc2626; }

  @media (max-width: 640px) {
    .ap-row2, .ap-row3 { grid-template-columns: 1fr; }
  }
</style>
