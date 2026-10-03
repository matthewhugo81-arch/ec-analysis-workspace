/* Playback uses timestamped still PNGs, never browser-driven GIF animation. */
(() => {
  const base = 'https://modeles20.meteociel.fr/satellite/';
  const states = new Map();
  const step = 10 * 60 * 1000;
  const pad = n => String(n).padStart(2, '0');
  function candidates(channel, now = Date.now()) {
    const end = Math.floor(now / step) * step;
    return Array.from({length: 19}, (_, i) => {
      const epoch = end - i * step, d = new Date(epoch);
      const day = d.toISOString().slice(0, 10).replaceAll('-', '');
      return {epoch, url: `${base}archives/${day}/sat${channel}mtgalt-${pad(d.getUTCHours())}-${pad(d.getUTCMinutes())}.png`};
    });
  }
  function loadFrame(frame) {
    return new Promise(resolve => {
      const image = new Image();
      const timeout = setTimeout(() => finish(null), 15000);
      function finish(value) {
        clearTimeout(timeout); image.onload = image.onerror = null; resolve(value);
      }
      image.onload = () => finish({...frame, image});
      image.onerror = () => finish(null);
      image.src = frame.url;
    });
  }
  function get(channel) {
    if (!states.has(channel)) states.set(channel, {channel, frames: [], index: 0, timer: null, loading: null, listener: null, message: '', loadedAt: 0});
    return states.get(channel);
  }
  function emit(s) { s.listener?.(); }
  function pause(s) { clearInterval(s.timer); s.timer = null; emit(s); }
  async function refresh(s) {
    if (s.loading) return s.loading;
    s.message = 'Loading observations…'; emit(s);
    s.loading = (async () => {
      const queue = candidates(s.channel), available = [];
      const known = new Map(s.frames.map(f => [f.url, f]));
      // Keep requests bounded and reuse images already loaded by this player.
      await Promise.all(Array.from({length: 3}, async () => {
        while (queue.length) {
          const frame = queue.shift();
          const found = known.get(frame.url) || await loadFrame(frame);
          if (found) available.push(found);
        }
      }));
      const selected = s.frames[s.index];
      const frames = available.sort((a,b) => a.epoch-b.epoch).slice(-13);
      if (frames.length) {
        // Refresh must never replace the observation a user has paused on.
        if (selected && !frames.some(f => f.url === selected.url)) frames.unshift(selected);
        s.frames = frames;
        s.index = selected ? frames.findIndex(f => f.url === selected.url) : frames.length - 1;
        s.loadedAt = Date.now();
        s.message = '';
      } else {
        s.message = s.frames.length ? 'Refresh failed · retained observations' : 'Archive unavailable · latest still shown';
      }
    })().finally(() => {s.loading = null; emit(s);});
    return s.loading;
  }
  function mount(img, channel) {
    const s = get(channel), panel = img.closest('.panel'), head = panel.querySelector('.panel-head');
    const bar = document.createElement('div'); bar.className = 'satellite-controls';
    bar.setAttribute('aria-label', `${channel.toUpperCase()} satellite playback`);
    const button = (text, label, action) => {
      const b = document.createElement('button'); b.textContent = text; b.setAttribute('aria-label', label); b.addEventListener('click', action); bar.append(b); return b;
    };
    function select(index) { pause(s); s.index = Math.max(0, Math.min(s.frames.length - 1, index)); emit(s); }
    const previous = button('−1', 'Previous satellite frame', () => select(s.index - 1));
    const play = button('Play', 'Play satellite loop', () => {
      if (s.timer) {pause(s); return;}
      if (s.frames.length < 2) return;
      s.timer = setInterval(() => {s.index = (s.index + 1) % s.frames.length; emit(s);}, 700);
      emit(s);
    });
    const next = button('+1', 'Next satellite frame', () => select(s.index + 1));
    const latest = button('Latest', 'Show latest satellite frame', () => select(s.frames.length - 1));
    const reload = button('Refresh', 'Refresh satellite observations', () => void refresh(s));
    const slider = document.createElement('input'); slider.type = 'range'; slider.min = '0'; slider.max = '0'; slider.step = '1';
    slider.setAttribute('aria-label', 'Satellite observation timeline'); slider.addEventListener('input', () => select(Number(slider.value)));
    const label = document.createElement('span'); label.className = 'satellite-time';
    const status = document.createElement('span'); status.className = 'satellite-status'; status.setAttribute('role', 'status');
    bar.append(slider, label, status); head.after(bar);
    s.listener = () => {
      if (!img.isConnected) {pauseWithoutEmit(s); return;}
      const frame = s.frames[s.index];
      if (frame && img.getAttribute('src') !== frame.url) img.src = frame.url;
      label.textContent = frame ? new Date(frame.epoch).toISOString().slice(0,16).replace('T', ' · ') + ' UTC' : 'Latest still · timestamp in image';
      slider.max = String(Math.max(0, s.frames.length-1)); slider.value = String(s.index);
      slider.disabled = s.frames.length < 2;
      play.textContent = s.timer ? 'Pause' : 'Play'; play.setAttribute('aria-label', s.timer ? 'Pause satellite loop' : 'Play satellite loop');
      play.setAttribute('aria-pressed', String(!!s.timer)); play.disabled = s.frames.length < 2;
      previous.disabled = s.index <= 0; next.disabled = s.index >= s.frames.length-1;
      latest.disabled = !s.frames.length; reload.disabled = !!s.loading;
      status.textContent = s.message;
    };
    if (!s.frames.length) img.src = `${base}latestsat${channel}mtgalt.png?t=${Date.now()}`;
    emit(s);
    if (!s.loadedAt || Date.now() - s.loadedAt > 120000) void refresh(s);
  }
  function pauseWithoutEmit(s) {clearInterval(s.timer); s.timer = null;}
  const api = {
    mount,
    pauseAll() {for (const s of states.values()) pause(s);},
    refresh(channel) {return refresh(get(channel));},
  };
  document.addEventListener('visibilitychange', () => {if(document.hidden) api.pauseAll();});
  window.SatelliteLoops = api;
  if (typeof module !== 'undefined') module.exports = {candidates, loadFrame, get, refresh, pause};
})();
