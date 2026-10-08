<script>
  import { onMount, onDestroy } from 'svelte';

  export let items = []; // [{ id, url, caption, kind }]
  export let autoplayMs = 5500;

  let active = 0;
  let timer = null;
  let paused = false;

  function go(i) {
    if (!items.length) return;
    active = ((i % items.length) + items.length) % items.length;
  }
  function next() { go(active + 1); }
  function prev() { go(active - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => { if (!paused) next(); }, autoplayMs);
  }
  function stopAutoplay() { if (timer) clearInterval(timer); }

  onMount(() => { startAutoplay(); });
  onDestroy(() => stopAutoplay());

  // reset to first slide if the item list changes size (e.g. after admin edits)
  $: if (items && active >= items.length) active = 0;
</script>

<div
  class="carousel"
  on:mouseenter={() => (paused = true)}
  on:mouseleave={() => (paused = false)}
>
  {#if items.length === 0}
    <div class="carousel-empty">No photos yet. Admin can add photos using the ⚙ button.</div>
  {:else}
    <div class="carousel-track">
      {#each items as item, i (item.id)}
        <div class="carousel-slide" class:is-active={i === active}>
          {#if item.kind === 'offer'}
            <span class="offer-ribbon">🔥 Sale Offer</span>
          {/if}
          <img src={item.url} alt={item.caption} loading={i === 0 ? 'eager' : 'lazy'} />
          <div class="carousel-caption-bar">
            <p>{item.caption}</p>
          </div>
        </div>
      {/each}
    </div>

    {#if items.length > 1}
      <button class="carousel-arrow carousel-arrow-left" on:click={prev} aria-label="Previous">‹</button>
      <button class="carousel-arrow carousel-arrow-right" on:click={next} aria-label="Next">›</button>

      <div class="carousel-dots">
        {#each items as item, i (item.id)}
          <button
            class="carousel-dot"
            class:is-active={i === active}
            on:click={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
          ></button>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .carousel {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 8;
    min-height: 360px;
    max-height: 640px;
    border-radius: 20px;
    overflow: hidden;
    background: #0f172a;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  }
  .carousel-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #94a3b8;
    font-size: 15px;
  }
  .carousel-track {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .carousel-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
  }
  .carousel-slide.is-active {
    opacity: 1;
    pointer-events: auto;
  }
  .carousel-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .offer-ribbon {
    position: absolute;
    top: 18px;
    left: 18px;
    z-index: 2;
    background: #ef4444;
    color: #fff;
    font-size: 13px;
    font-weight: 800;
    padding: 7px 16px;
    border-radius: 999px;
    box-shadow: 0 6px 18px rgba(239, 68, 68, 0.45);
    letter-spacing: 0.02em;
  }
  .carousel-caption-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 36px 28px 24px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 100%);
  }
  .carousel-caption-bar p {
    color: #fff;
    font-size: clamp(16px, 2.2vw, 22px);
    font-weight: 700;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  }

  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.85);
    color: #0f172a;
    font-size: 26px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
    z-index: 3;
  }
  .carousel-arrow:hover {
    background: #fff;
    transform: translateY(-50%) scale(1.08);
  }
  .carousel-arrow-left { left: 18px; }
  .carousel-arrow-right { right: 18px; }

  .carousel-dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 3;
  }
  .carousel-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1.5px solid rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    padding: 0;
    transition: all 0.2s;
  }
  .carousel-dot.is-active {
    background: #f97316;
    border-color: #f97316;
    width: 24px;
    border-radius: 999px;
  }

  @media (max-width: 700px) {
    .carousel { aspect-ratio: 4 / 5; min-height: 320px; }
    .carousel-arrow { width: 36px; height: 36px; font-size: 20px; }
  }
</style>
