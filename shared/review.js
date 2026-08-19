// Accept / reject / comment bar.
// Posts to the local review API when it is available (npm run sites) and always
// mirrors the verdict into localStorage so the deployed copy still works offline.

;(() => {
  const root = document.documentElement
  const id = root.dataset.designId
  if (!id) return

  const title = root.dataset.designTitle ?? id
  const storageKey = `design-review:${id}`
  const endpoint = '/api/review'

  const state = load()

  function load() {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : { verdict: null, comment: '' }
    } catch {
      return { verdict: null, comment: '' }
    }
  }

  function persistLocal() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      /* private mode — the API copy is still authoritative */
    }
  }

  async function persistRemote() {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id,
        title,
        verdict: state.verdict,
        comment: state.comment,
        updatedAt: new Date().toISOString(),
      }),
    })
    if (!response.ok) throw new Error(`review api ${response.status}`)
  }

  const bar = document.createElement('div')
  bar.className = 'review-bar'
  bar.dataset.collapsed = 'false'
  bar.innerHTML = `
    <span class="review-bar__label">${title}</span>
    <div class="review-bar__body">
      <button class="review-button" data-verdict="accepted" type="button">Accept</button>
      <button class="review-button" data-verdict="rejected" type="button">Reject</button>
      <input class="review-bar__comment" type="text" placeholder="Add a comment…" />
      <button class="review-button" data-action="save" type="button">Save</button>
      <span class="review-bar__status"></span>
    </div>
    <button class="review-button review-button--ghost" data-action="toggle" type="button">Hide</button>
  `

  const buttons = [...bar.querySelectorAll('[data-verdict]')]
  const comment = bar.querySelector('.review-bar__comment')
  const status = bar.querySelector('.review-bar__status')
  const toggle = bar.querySelector('[data-action="toggle"]')

  function paint() {
    for (const button of buttons) {
      button.dataset.state = button.dataset.verdict === state.verdict ? 'on' : 'off'
    }
  }

  async function save(message) {
    persistLocal()
    paint()
    try {
      await persistRemote()
      status.textContent = `${message} · saved to feedback/reviews.json`
    } catch {
      status.textContent = `${message} · saved in this browser`
    }
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      state.verdict = state.verdict === button.dataset.verdict ? null : button.dataset.verdict
      state.comment = comment.value.trim()
      save(state.verdict ? `Marked ${state.verdict}` : 'Verdict cleared')
    })
  }

  bar.querySelector('[data-action="save"]').addEventListener('click', () => {
    state.comment = comment.value.trim()
    save('Comment saved')
  })

  comment.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    state.comment = comment.value.trim()
    save('Comment saved')
  })

  toggle.addEventListener('click', () => {
    const collapsed = bar.dataset.collapsed === 'true'
    bar.dataset.collapsed = collapsed ? 'false' : 'true'
    toggle.textContent = collapsed ? 'Hide' : 'Review'
  })

  comment.value = state.comment ?? ''
  paint()
  if (state.verdict) status.textContent = `Currently ${state.verdict}`

  // Reserve exactly as much room as the bar occupies, so a tall wrapped bar on a narrow
  // screen never covers the design underneath it.
  function reserveSpace() {
    const height = bar.getBoundingClientRect().height
    document.body.style.setProperty('--review-bar-height', `${Math.ceil(height)}px`)
    document.body.style.paddingBottom = `${Math.ceil(height) + 24}px`
  }

  function mount() {
    document.body.append(bar)
    reserveSpace()
    new ResizeObserver(reserveSpace).observe(bar)
    addEventListener('resize', reserveSpace, { passive: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true })
  } else {
    mount()
  }
})()
