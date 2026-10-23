<script>
  // A picture field: preview + URL box + "Upload from device" button.
  export let value = '';
  export let label = 'Picture';
  export let pass = '';

  let busy = false;
  let err = '';

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    err = '';
    if (file.size > 4 * 1024 * 1024) {
      err = 'Image is larger than 4 MB — please pick a smaller one.';
      e.target.value = '';
      return;
    }
    busy = true;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': pass },
        body: fd
      });
      if (!res.ok) throw new Error((await res.text()) || 'Upload failed');
      value = (await res.json()).url;
    } catch (ex) {
      err = 'Upload failed. Try again.';
    }
    busy = false;
    e.target.value = '';
  }
</script>

<div class="imgfield">
  <span class="imgfield-label">{label}</span>
  <div class="imgfield-row">
    <div class="imgfield-thumb">
      {#if value}<img src={value} alt="" />{:else}<span>No picture</span>{/if}
    </div>
    <div class="imgfield-ctrl">
      <input bind:value placeholder="Paste image URL…" />
      <label class="imgfield-btn" class:busy>
        {busy ? 'Uploading…' : '📁 Upload from device'}
        <input type="file" accept="image/*" on:change={onPick} disabled={busy} hidden />
      </label>
      {#if err}<small class="imgfield-err">{err}</small>{/if}
    </div>
  </div>
</div>

<style>
  .imgfield { display: flex; flex-direction: column; gap: 6px; }
  .imgfield-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .04em; }
  .imgfield-row { display: flex; gap: 12px; align-items: flex-start; }
  .imgfield-thumb { width: 120px; height: 80px; border-radius: 8px; overflow: hidden; background: #f3f4f6; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px; color: #9ca3af; }
  .imgfield-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .imgfield-ctrl { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .imgfield-ctrl input { border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; font-size: 13px; outline: none; width: 100%; }
  .imgfield-ctrl input:focus { border-color: #f97316; }
  .imgfield-btn { align-self: flex-start; background: #f97316; color: #fff; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; }
  .imgfield-btn.busy { opacity: .6; cursor: wait; }
  .imgfield-err { color: #dc2626; font-size: 12px; }
</style>
