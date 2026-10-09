// Hash routes keep the page, class, and question in the URL so a view can be shared:
//   #/?class=<scope>&q=<id>          home (instant summary)
//   #/details?class=<scope>&q=<id>   in-depth analysis
export function readRoute() {
  const [path, query = ''] = window.location.hash.replace(/^#/, '').split('?')
  const p = new URLSearchParams(query)
  return { page: path === '/details' ? 'details' : 'home', scope: p.get('class'), q: p.get('q') }
}

export function href({ page, scope, q }) {
  const p = new URLSearchParams()
  if (scope) p.set('class', scope)
  if (q) p.set('q', q)
  return `#/${page === 'details' ? 'details' : ''}?${p}`
}

// "2025-10-14" -> "Oct 14, 2025"
export function fmtDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
