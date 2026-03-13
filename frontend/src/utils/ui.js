// UI helpers: className merging and common formatting utilities

export const cn = (...parts) => parts.filter(Boolean).join(' ')

export const formatINR = (value) => {
  const n = Number(value || 0)
  if (!Number.isFinite(n)) return '0'
  return n.toLocaleString('en-IN')
}

export const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

