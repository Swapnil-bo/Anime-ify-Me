import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Character count thresholds ───────────────────────────────────────────────
const MIN_CHARS = 10
const MAX_CHARS = 500
const SWEET_SPOT = { min: 60, max: 300 }

// ─── Placeholder cycling ──────────────────────────────────────────────────────
const PLACEHOLDERS = [
  "A quiet overthinker who laughs too loud to hide the silence...",
  "Fiercely loyal, terrifyingly stubborn, secretly terrified of being forgotten...",
  "The one who stays until 3am fixing problems that aren't theirs to fix...",
  "Soft-spoken in crowds, relentless when alone with a goal...",
  "Someone who collects hobbies like armour and calls none of them a passion...",
  "Endlessly curious. Rarely satisfied. Always two steps ahead of the room.",
  "The person who reads the ending first and still cries at the middle...",
]

// ─── Prompt sparks — help users go deeper ────────────────────────────────────
const SPARKS = [
  "your greatest contradiction",
  "what you'd die protecting",
  "the wound that made you stronger",
  "how you love vs how you fight",
  "your relationship with silence",
]

function CharacterMeter({ count }) {
  const pct     = Math.min((count / MAX_CHARS) * 100, 100)
  const tooShort = count > 0 && count < MIN_CHARS
  const sweet    = count >= SWEET_SPOT.min && count <= SWEET_SPOT.max
  const tooLong  = count > MAX_CHARS

  const color = tooLong  ? 'var(--crimson)'
              : sweet    ? 'var(--sage)'
              : count > 0 ? 'var(--soul-gold)'
              : 'rgba(255,255,255,0.08)'

  const label = tooLong  ? 'Too long'
              : sweet    ? 'Sweet spot'
              : tooShort ? 'Keep going...'
              : count > 0 ? `${MAX_CHARS - count} left`
              : ''

  return (
    <div className="flex items-center justify-between mt-2 gap-3">
      {/* Progress bar */}
      <div
        className="flex-1 h-px relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{ background: color, boxShadow: sweet ? `0 0 8px ${color}` : 'none' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        {label && (
          <motion.span
            key={label}
            className="font-rajdhani text-xs font-semibold tracking-widest"
            style={{ color, minWidth: '70px', textAlign: 'right', letterSpacing: '0.15em' }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

function SparkChip({ label, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="font-rajdhani text-xs px-3 py-1 tracking-wide"
      style={{
        border:     '1px solid rgba(255,214,10,0.12)',
        color:      'rgba(255,214,10,0.45)',
        background: 'rgba(255,214,10,0.03)',
        letterSpacing: '0.05em',
        cursor:     'none',
      }}
      whileHover={{
        borderColor: 'rgba(255,214,10,0.35)',
        color:       'rgba(255,214,10,0.85)',
        background:  'rgba(255,214,10,0.06)',
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      + {label}
    </motion.button>
  )
}

export default function InputForm({ onSubmit }) {
  const [value,       setValue]       = useState('')
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0])
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [isFocused,   setIsFocused]   = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef(null)

  // Cycle placeholders every 4s when unfocused and empty
  useEffect(() => {
    if (isFocused || value) return
    const id = setInterval(() => {
      setPlaceholderIdx(i => {
        const next = (i + 1) % PLACEHOLDERS.length
        setPlaceholder(PLACEHOLDERS[next])
        return next
      })
    }, 4000)
    return () => clearInterval(id)
  }, [isFocused, value])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 260)}px`
  }, [value])

  const canSubmit = value.trim().length >= MIN_CHARS && value.trim().length <= MAX_CHARS && !isSubmitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    await onSubmit(value.trim())
    setIsSubmitting(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const appendSpark = (spark) => {
    const addition = value
      ? `${value.trimEnd()}, ${spark}`
      : `Tell me about ${spark}: `
    setValue(addition)
    textareaRef.current?.focus()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* ── Main input panel ── */}
      <div className="glass-panel relative p-6 mb-4">
        <span className="bracket-tl" />
        <span className="bracket-tr" />
        <span className="bracket-bl" />
        <span className="bracket-br" />

        {/* Section label */}
        <div className="section-header mb-4">
          <span className="section-header-text">Describe Yourself</span>
          <div className="section-header-line" />
          <span
            className="font-noto-jp text-xs"
            style={{ color: 'var(--text-ghost)', fontSize: '0.65rem' }}
          >
            自己紹介
          </span>
        </div>

        {/* Textarea wrapper */}
        <div className="anime-input-wrap">
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  border:    '1px solid rgba(230,57,70,0.15)',
                  boxShadow: '0 0 40px rgba(230,57,70,0.04)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{   opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            className="anime-input"
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            rows={4}
            maxLength={MAX_CHARS + 10}
            style={{ minHeight: '120px', lineHeight: 1.7 }}
          />
        </div>

        {/* Character meter */}
        <CharacterMeter count={value.length} />

        {/* Cmd+Enter hint */}
        <AnimatePresence>
          {isFocused && value.length > 0 && (
            <motion.p
              className="font-rajdhani text-xs mt-2"
              style={{ color: 'var(--text-ghost)', letterSpacing: '0.1em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{   opacity: 0 }}
            >
              ⌘ + Enter to forge
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Prompt sparks ── */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p
          className="font-rajdhani text-xs mb-2 tracking-widest uppercase"
          style={{ color: 'var(--text-ghost)', letterSpacing: '0.25em' }}
        >
          Need a spark?
        </p>
        <div className="flex flex-wrap gap-2">
          {SPARKS.map(spark => (
            <SparkChip
              key={spark}
              label={spark}
              onClick={() => appendSpark(spark)}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Submit button ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <motion.button
          className="btn-forge w-full"
          onClick={handleSubmit}
          disabled={!canSubmit}
          animate={{
            opacity: canSubmit ? 1 : 0.35,
            scale:   canSubmit ? 1 : 0.99,
          }}
          whileHover={canSubmit ? { scale: 1.01 } : {}}
          whileTap={canSubmit   ? { scale: 0.99 } : {}}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: canSubmit ? 'auto' : 'none' }}
        >
          <span className="flex items-center justify-center gap-3">
            {/* Animated forge icon */}
            <motion.span
              style={{ fontSize: '1rem', lineHeight: 1 }}
              animate={canSubmit ? {
                rotate: [0, -10, 10, -10, 0],
                transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }
              } : {}}
            >
              ⚡
            </motion.span>
            <span>
              {isSubmitting ? 'Forging...' : 'Forge My Anime Self'}
            </span>
          </span>
        </motion.button>

        {/* Subtext below button */}
        <motion.p
          className="text-center font-rajdhani text-xs mt-3"
          style={{ color: 'var(--text-ghost)', letterSpacing: '0.15em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your words never leave this machine
        </motion.p>
      </motion.div>
    </motion.div>
  )
}