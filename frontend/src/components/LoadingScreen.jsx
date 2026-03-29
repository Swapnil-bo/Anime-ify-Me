import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Forge stages — what Mistral is "doing" ───────────────────────────────────
const STAGES = [
  { kanji: '魂',  label: 'Reading your soul',         sub: 'Scanning emotional frequency...' },
  { kanji: '名',  label: 'Forging your name',          sub: 'Cross-referencing 10,000 anime lineages...' },
  { kanji: '力',  label: 'Awakening your power',       sub: 'Binding trauma to technique...' },
  { kanji: '剣',  label: 'Sharpening your backstory',  sub: 'Carving the wound that never healed...' },
  { kanji: '星',  label: 'Placing you in the universe', sub: 'Finding the series that holds your soul...' },
  { kanji: '炎',  label: 'Sealing your catchphrase',   sub: 'Waiting for the right moment of silence...' },
]

// ─── Haiku lines shown while waiting ─────────────────────────────────────────
const HAIKUS = [
  ["Even the sword", "does not know what it will cut", "until it is swung."],
  ["The wound remembers", "what the mind has tried to bury", "power grows from there."],
  ["Not chosen by fate —", "but by what you refused", "to let break you twice."],
  ["Every great villain", "was someone's favourite hero", "before the last act."],
  ["The quiet ones burn", "the longest — cold flame, deep root,", "impossible to kill."],
]

// ─── Scan line component ──────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        height:     '1px',
        background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.6), transparent)',
        boxShadow:  '0 0 12px rgba(230,57,70,0.4)',
        zIndex:     10,
      }}
      initial={{ top: '-2%' }}
      animate={{ top: '102%' }}
      transition={{
        duration: 2.2,
        ease:     'linear',
        repeat:   Infinity,
        repeatDelay: 1.2,
      }}
    />
  )
}

// ─── Kanji ring — orbiting characters ────────────────────────────────────────
function KanjiRing({ activeKanji }) {
  const RING_KANJI = ['魂', '名', '力', '剣', '星', '炎', '道', '影']
  const radius = 72

  return (
    <div className="relative" style={{ width: 200, height: 200 }}>
      {/* Outer ring track */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: '1px solid rgba(230,57,70,0.08)' }}
      />
      {/* Middle ring track */}
      <div
        className="absolute rounded-full"
        style={{
          inset:  '20px',
          border: '1px solid rgba(255,214,10,0.05)',
        }}
      />

      {/* Orbiting kanji */}
      {RING_KANJI.map((k, i) => {
        const angle = (i / RING_KANJI.length) * Math.PI * 2
        const x = Math.cos(angle) * radius + 100
        const y = Math.sin(angle) * radius + 100
        const isActive = k === activeKanji

        return (
          <motion.div
            key={k}
            className="absolute font-noto-jp"
            style={{
              left:      x,
              top:       y,
              transform: 'translate(-50%, -50%)',
              fontSize:  isActive ? '1.1rem' : '0.75rem',
              color:     isActive ? 'var(--crimson)' : 'rgba(232,232,240,0.08)',
              textShadow: isActive ? '0 0 20px var(--crimson)' : 'none',
              transition: 'all 0.4s cubic-bezier(0.19,1,0.22,1)',
            }}
            animate={isActive ? {
              scale: [1, 1.3, 1],
              transition: { duration: 0.5 }
            } : {}}
          >
            {k}
          </motion.div>
        )
      })}

      {/* Center — active kanji hero */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKanji}
            className="font-noto-jp text-center"
            style={{
              fontSize:   '3.5rem',
              color:      'var(--crimson)',
              textShadow: '0 0 40px rgba(230,57,70,0.5), 0 0 80px rgba(230,57,70,0.2)',
              lineHeight: 1,
            }}
            initial={{ opacity: 0, scale: 0.5, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1,   filter: 'blur(0px)' }}
            exit={{   opacity: 0, scale: 1.5,  filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            {activeKanji}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rotating glow arc */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent 80%, rgba(230,57,70,0.15) 95%, transparent 100%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
      />
    </div>
  )
}

// ─── Haiku display ────────────────────────────────────────────────────────────
function HaikuDisplay({ lines }) {
  return (
    <div className="text-center" style={{ minHeight: '5rem' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={lines[0]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{   opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {lines.map((line, i) => (
            <motion.p
              key={i}
              className="font-noto-jp"
              style={{
                fontSize:      '0.8rem',
                fontWeight:    300,
                color:         i === 1 ? 'rgba(232,232,240,0.5)' : 'rgba(232,232,240,0.25)',
                letterSpacing: '0.05em',
                lineHeight:    2,
                fontStyle:     'italic',
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.25, duration: 0.6 }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Stage progress dots ──────────────────────────────────────────────────────
function StageDots({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            width:        i === current ? 20 : 4,
            height:       4,
            background:   i < current  ? 'var(--crimson)'
                        : i === current ? 'var(--soul-gold)'
                        : 'rgba(255,255,255,0.08)',
            boxShadow:    i === current ? '0 0 8px var(--soul-gold)' : 'none',
          }}
          animate={{ width: i === current ? 20 : i < current ? 4 : 4 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        />
      ))}
    </div>
  )
}

// ─── Main LoadingScreen ───────────────────────────────────────────────────────
export default function LoadingScreen() {
  const [stageIdx,   setStageIdx]   = useState(0)
  const [haikuIdx,   setHaikuIdx]   = useState(0)
  const [elapsed,    setElapsed]    = useState(0)
  const [glitching,  setGlitching]  = useState(false)
  const startRef = useRef(Date.now())

  const stage = STAGES[stageIdx]

  // Advance forge stages every ~8s
  useEffect(() => {
    const id = setInterval(() => {
      setStageIdx(i => Math.min(i + 1, STAGES.length - 1))

      // Trigger glitch flash on stage change
      setGlitching(true)
      setTimeout(() => setGlitching(false), 400)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  // Cycle haikus every 12s
  useEffect(() => {
    const id = setInterval(() => {
      setHaikuIdx(i => (i + 1) % HAIKUS.length)
    }, 12000)
    return () => clearInterval(id)
  }, [])

  // Elapsed time counter
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')

  return (
    <motion.div
      className="relative glass-panel overflow-hidden"
      style={{ minHeight: '520px' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Corner brackets */}
      <span className="bracket-tl" />
      <span className="bracket-tr" />
      <span className="bracket-bl" />
      <span className="bracket-br" />

      {/* Scan line sweep */}
      <ScanLine />

      {/* Glitch flash on stage change */}
      <AnimatePresence>
        {glitching && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(230,57,70,0.04)', zIndex: 5 }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center p-8 gap-8">

        {/* ── Top label ── */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="h-px w-8"
            style={{ background: 'linear-gradient(to right, transparent, var(--crimson))' }}
          />
          <span
            className="font-rajdhani text-xs tracking-widest uppercase"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.35em' }}
          >
            Forging in progress
          </span>
          <div
            className="h-px w-8"
            style={{ background: 'linear-gradient(to left, transparent, var(--crimson))' }}
          />
        </motion.div>

        {/* ── Kanji ring ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        >
          <KanjiRing activeKanji={stage.kanji} />
        </motion.div>

        {/* ── Stage label ── */}
        <div className="text-center" style={{ minHeight: '3.5rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIdx}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
              exit={{   opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              <p
                className="font-cinzel text-sm font-semibold tracking-widest mb-1"
                style={{ color: 'var(--text-primary)', letterSpacing: '0.2em' }}
              >
                {stage.label}
              </p>
              <p
                className="font-rajdhani text-xs"
                style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
              >
                {stage.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Stage progress dots ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <StageDots current={stageIdx} total={STAGES.length} />
        </motion.div>

        {/* ── Divider ── */}
        <div className="w-full divider-blade">
          <span className="divider-kanji">詩</span>
        </div>

        {/* ── Haiku ── */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p
            className="font-rajdhani text-xs text-center mb-3 tracking-widest uppercase"
            style={{ color: 'var(--text-ghost)', letterSpacing: '0.3em' }}
          >
            — while you wait —
          </p>
          <HaikuDisplay lines={HAIKUS[haikuIdx]} />
        </motion.div>

        {/* ── Elapsed time + local note ── */}
        <motion.div
          className="flex items-center justify-between w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span
            className="font-rajdhani text-xs"
            style={{
              color:         'var(--text-ghost)',
              letterSpacing: '0.15em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {mins}:{secs}
          </span>

          {/* Three bouncing dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                style={{
                  width:        3,
                  height:       3,
                  borderRadius: '50%',
                  background:   'var(--crimson)',
                }}
                animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration:   0.9,
                  repeat:     Infinity,
                  delay:      i * 0.18,
                  ease:       'easeInOut',
                }}
              />
            ))}
          </div>

          <span
            className="font-rajdhani text-xs"
            style={{ color: 'var(--text-ghost)', letterSpacing: '0.1em' }}
          >
            Mistral 7B · local
          </span>
        </motion.div>

      </div>
    </motion.div>
  )
}