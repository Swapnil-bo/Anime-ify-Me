import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Stat configuration ───────────────────────────────────────────────────────
const STAT_CONFIG = {
  STR:    { color: 'var(--stat-str)',    label: 'STR',    full: 'Strength'  },
  INT:    { color: 'var(--stat-int)',    label: 'INT',    full: 'Intellect' },
  CHI:    { color: 'var(--stat-chi)',    label: 'CHI',    full: 'Spirit'    },
  WILL:   { color: 'var(--stat-will)',   label: 'WILL',   full: 'Willpower' },
  SHADOW: { color: 'var(--stat-shadow)', label: 'SHADOW', full: 'Darkness'  },
}

// ─── Parse "Technique Name: poetic description" ───────────────────────────────
function parseTechnique(technique) {
  const idx = technique.indexOf(':')
  if (idx === -1) return { name: technique, desc: '' }
  return {
    name: technique.slice(0, idx).trim(),
    desc: technique.slice(idx + 1).trim(),
  }
}

// ─── Section wrapper — staggered blur-fade reveal ─────────────────────────────
function Section({ label, kanji, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
      transition={{ delay, duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="section-header">
        <span className="section-header-text">{label}</span>
        {kanji && (
          <span
            className="font-noto-jp"
            style={{ fontSize: '0.6rem', color: 'var(--text-ghost)' }}
          >
            {kanji}
          </span>
        )}
        <div className="section-header-line" />
      </div>
      {children}
    </motion.div>
  )
}

// ─── Animated stat bar ────────────────────────────────────────────────────────
function StatBar({ statKey, value, delay }) {
  const config  = STAT_CONFIG[statKey]
  if (!config) return null
  const clamped = Math.max(0, Math.min(100, Math.round(value)))

  // Tier label
  const tier = clamped >= 90 ? 'LEGENDARY'
             : clamped >= 75 ? 'ELITE'
             : clamped >= 55 ? 'HIGH'
             : clamped >= 35 ? 'MID'
             : 'LOW'

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000, duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="stat-row">
        {/* Label */}
        <div>
          <span
            className="stat-label block"
            style={{ color: config.color, opacity: 0.9 }}
          >
            {config.label}
          </span>
          <span
            className="font-rajdhani"
            style={{ fontSize: '0.5rem', color: 'var(--text-ghost)', letterSpacing: '0.15em' }}
          >
            {tier}
          </span>
        </div>

        {/* Track + fill */}
        <div className="stat-track">
          <div
            className="stat-fill"
            style={{
              '--stat-width': `${clamped}%`,
              '--stat-delay': `${delay}ms`,
              background:     config.color,
              color:          config.color,
            }}
          />
        </div>

        {/* Value — blur-counts in after bar fills */}
        <motion.span
          className="stat-value"
          style={{ color: config.color }}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 0.8, filter: 'blur(0px)' }}
          transition={{ delay: delay / 1000 + 1.3, duration: 0.35 }}
        >
          {clamped}
        </motion.span>
      </div>
    </motion.div>
  )
}

// ─── Catchphrase — word-by-word dramatic reveal ───────────────────────────────
function CatchphraseReveal({ text }) {
  const words = text.split(' ')

  return (
    <div className="catchphrase">
      <motion.span
        style={{ display: 'block' }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.07, delayChildren: 0.1 },
          },
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
            variants={{
              hidden:  { opacity: 0, y: 10, filter: 'blur(6px)' },
              visible: { opacity: 1, y: 0,  filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </div>
  )
}

// ─── Power origin line ────────────────────────────────────────────────────────
function PowerOrigin({ text }) {
  return (
    <motion.div
      className="mt-3 pt-3"
      style={{ borderTop: '1px solid rgba(76,201,240,0.08)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.65, duration: 0.5 }}
    >
      <p
        className="font-rajdhani text-xs mb-1 tracking-widest uppercase"
        style={{ color: 'rgba(76,201,240,0.35)', letterSpacing: '0.2em' }}
      >
        Power Origin
      </p>
      <p
        className="lore-text"
        style={{ fontSize: '0.8rem', color: 'rgba(232,232,240,0.5)', fontStyle: 'italic' }}
      >
        {text}
      </p>
    </motion.div>
  )
}

// ─── Universe block ───────────────────────────────────────────────────────────
function InfoBlock({ accentColor, label, children }) {
  return (
    <div
      className="p-4 relative overflow-hidden"
      style={{
        background: `rgba(${accentColor}, 0.03)`,
        border:     `1px solid rgba(${accentColor}, 0.1)`,
        borderLeft: `3px solid rgba(${accentColor}, 0.4)`,
      }}
    >
      <div
        className="absolute top-0 right-0 bottom-0 w-1/3 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at right, rgba(${accentColor}, 0.04), transparent)`,
        }}
      />
      <p
        className="font-rajdhani text-xs mb-1.5 tracking-widest uppercase"
        style={{ color: `rgba(${accentColor}, 0.5)`, letterSpacing: '0.2em' }}
      >
        {label}
      </p>
      <p className="lore-text" style={{ fontSize: '0.82rem' }}>{children}</p>
    </div>
  )
}

// ─── AnimeCard ────────────────────────────────────────────────────────────────
export default function AnimeCard({ character, onReset }) {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef(null)

  const {
    anime_name,    title,      archetype,
    backstory,     power_name, technique,
    power_origin,  stats,      anime_universe,
    rival,         alignment,  catchphrase,
    theme_song,
  } = character

  const tech = parseTechnique(technique)

  // Build alignment color hint
  const alignmentColor =
    alignment?.toLowerCase().includes('chaotic') ? 'var(--crimson)'   :
    alignment?.toLowerCase().includes('lawful')  ? 'var(--power-blue)':
    alignment?.toLowerCase().includes('evil')    ? 'var(--shadow-purple)' :
    alignment?.toLowerCase().includes('good')    ? 'var(--sage)'      :
    'var(--soul-gold)'

  // Copy full character sheet to clipboard
  const handleCopy = async () => {
    const bars = (v) => '█'.repeat(Math.round(v / 10)).padEnd(10, '░')
    const sheet = `
╔══════════════════════════════════════════╗
  ${anime_name}
  ${title}
╚══════════════════════════════════════════╝

ARCHETYPE  ${archetype}
ALIGNMENT  ${alignment}

── ORIGIN ──────────────────────────────────
${backstory}

── ABILITY ─────────────────────────────────
${power_name}
${tech.name}: ${tech.desc}
Origin: ${power_origin}

── COMBAT PROFILE ──────────────────────────
${Object.entries(stats).map(([k, v]) =>
  `  ${k.padEnd(8)} ${bars(v)} ${v}`
).join('\n')}

── THEIR WORLD ─────────────────────────────
Universe: ${anime_universe}
Rival:    ${rival}

── SIGNATURE LINE ───────────────────────────
"${catchphrase}"

Theme Song: ${theme_song}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by Anime-ify Me · Mistral 7B · Local
`.trim()

    try {
      await navigator.clipboard.writeText(sheet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  return (
    <div ref={cardRef} className="anime-card relative" style={{ overflow: 'hidden' }}>

      {/* ── Entry flash — TV-on effect ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(230,57,70,0.1)', zIndex: 20 }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* ── Horizontal scan sweep on entry ── */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height:     '2px',
          background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.5), transparent)',
          boxShadow:  '0 0 16px rgba(230,57,70,0.4)',
          zIndex:     21,
        }}
        initial={{ top: '-2%', opacity: 1 }}
        animate={{ top: '102%', opacity: 0 }}
        transition={{ duration: 1.0, ease: 'easeIn', delay: 0.1 }}
      />

      {/* Corner brackets — larger on the card */}
      {['tl','tr','bl','br'].map(pos => (
        <span
          key={pos}
          className={`bracket-${pos}`}
          style={{ width: 22, height: 22 }}
        />
      ))}

      {/* ── Ambient top glow ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height:     '280px',
          background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(230,57,70,0.07), transparent)',
          zIndex:     0,
        }}
      />

      {/* ── Alignment glow — bottom corner ── */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width:      '200px',
          height:     '200px',
          background: `radial-gradient(circle at bottom right, ${alignmentColor}18, transparent 70%)`,
          zIndex:     0,
        }}
      />

      {/* ─────────────────────────────────────────────
          CONTENT
      ───────────────────────────────────────────── */}
      <div className="relative z-10 p-6 flex flex-col gap-6">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Top row: label + alignment */}
          <div className="flex items-center justify-between mb-4">
            <span className="label-pill crimson">Character Profile</span>
            <div
              className="alignment-badge"
              style={{ borderColor: `${alignmentColor}30`, color: alignmentColor }}
            >
              <motion.span
                style={{
                  width:        6,
                  height:       6,
                  borderRadius: '50%',
                  background:   alignmentColor,
                  display:      'inline-block',
                  marginRight:  '0.35rem',
                  boxShadow:    `0 0 6px ${alignmentColor}`,
                }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {alignment}
            </div>
          </div>

          {/* Character name */}
          <h2 className="character-name">{anime_name}</h2>

          {/* Epithet */}
          <motion.p
            className="character-title mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            — {title} —
          </motion.p>

          {/* Archetype */}
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="archetype-badge">
              <span style={{ color: 'var(--crimson)', fontSize: '0.65rem', flexShrink: 0 }}>◆</span>
              {archetype}
            </div>
          </motion.div>
        </motion.div>

        {/* ── DIVIDER: 物語 = Story ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          style={{ transformOrigin: 'left' }}
        >
          <div className="divider-blade">
            <span className="divider-kanji">物語</span>
          </div>
        </motion.div>

        {/* ── BACKSTORY ── */}
        <Section label="Origin Story" kanji="起源" delay={0.35}>
          <p className="lore-text">{backstory}</p>
        </Section>

        {/* ── POWER BLOCK ── */}
        <Section label="Ability" kanji="能力" delay={0.5}>
          <div className="power-block">
            <div className="relative z-10">

              {/* Power name */}
              <p className="power-name">{power_name}</p>

              {/* 必殺技 = Finishing technique */}
              <div className="divider-blade" style={{ margin: '0.6rem 0' }}>
                <span className="divider-kanji" style={{ fontSize: '0.5rem' }}>必殺技</span>
              </div>

              {/* Technique */}
              <div className="mb-1">
                <span className="technique-name">{tech.name}</span>
              </div>
              {tech.desc && (
                <p className="technique-text">
                  &ldquo;{tech.desc}&rdquo;
                </p>
              )}

              {/* Power origin */}
              <PowerOrigin text={power_origin} />
            </div>
          </div>
        </Section>

        {/* ── STATS ── */}
        <Section label="Combat Profile" kanji="戦闘" delay={0.65}>
          <div className="flex flex-col gap-3.5">
            {Object.entries(stats).map(([key, value], i) => (
              <StatBar
                key={key}
                statKey={key}
                value={value}
                delay={750 + i * 130}
              />
            ))}
          </div>

          {/* Stat total */}
          <motion.div
            className="mt-4 pt-3 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <span
              className="font-rajdhani text-xs tracking-widest uppercase"
              style={{ color: 'var(--text-ghost)', letterSpacing: '0.2em' }}
            >
              Total Power Index
            </span>
            <span
              className="font-cinzel text-sm font-bold"
              style={{ color: 'var(--soul-gold)', textShadow: '0 0 12px var(--soul-gold-glow)' }}
            >
              {Object.values(stats).reduce((a, b) => a + b, 0)}
              <span
                className="font-rajdhani text-xs ml-1"
                style={{ color: 'var(--text-muted)', fontWeight: 400 }}
              >
                / 500
              </span>
            </span>
          </motion.div>
        </Section>

        {/* ── DIVIDER: 世界 = World ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          style={{ transformOrigin: 'left' }}
        >
          <div className="divider-blade">
            <span className="divider-kanji">世界</span>
          </div>
        </motion.div>

        {/* ── UNIVERSE + RIVAL ── */}
        <Section label="Their World" kanji="宇宙" delay={0.95}>
          <div className="flex flex-col gap-3">
            <InfoBlock accentColor="255,214,10" label="Anime Universe">
              {anime_universe}
            </InfoBlock>
            <InfoBlock accentColor="123,45,139" label="Narrative Rival">
              {rival}
            </InfoBlock>
          </div>
        </Section>

        {/* ── DIVIDER: 言葉 = Words ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
        >
          <div className="divider-blade">
            <span className="divider-kanji">言葉</span>
          </div>
        </motion.div>

        {/* ── CATCHPHRASE — the money moment ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <p
            className="font-rajdhani text-xs text-center mb-3 tracking-widest uppercase"
            style={{ color: 'var(--text-ghost)', letterSpacing: '0.35em' }}
          >
            — Signature Line —
          </p>

          {/* Gold ambient glow */}
          <div className="relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,214,10,0.05), transparent 70%)',
              }}
            />
            <div
              className="relative"
              style={{
                border:    '1px solid rgba(255,214,10,0.08)',
                background:'rgba(255,214,10,0.02)',
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25 }}
              >
                <CatchphraseReveal text={catchphrase} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── THEME SONG ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.55, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="theme-song-block">
            <div className="vinyl-icon flex-shrink-0" />
            <div className="min-w-0">
              <p
                className="font-rajdhani text-xs tracking-widest uppercase mb-0.5"
                style={{ color: 'rgba(123,45,139,0.5)', letterSpacing: '0.2em' }}
              >
                Theme Song
              </p>
              <p
                className="font-rajdhani text-sm font-semibold truncate"
                style={{ color: 'rgba(123,45,139,0.85)' }}
              >
                {theme_song}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── ACTIONS ── */}
        <motion.div
          className="flex flex-col gap-3 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.4 }}
        >
          {/* Copy character sheet */}
          <button
            className="btn-ghost w-full"
            onClick={handleCopy}
            style={{ justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 6  }}
                  animate={{ opacity: 1, y: 0  }}
                  exit={{   opacity: 0, y: -6  }}
                  style={{ color: 'var(--sage)' }}
                >
                  <span>✓</span>
                  <span>Character Sheet Copied</span>
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 6  }}
                  animate={{ opacity: 1, y: 0  }}
                  exit={{   opacity: 0, y: -6  }}
                >
                  <span>↗</span>
                  <span>Copy Character Sheet</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Forge another */}
          <button className="btn-forge w-full" onClick={onReset}>
            <span className="flex items-center justify-center gap-2">
              <span>⚡</span>
              <span>Forge Another</span>
            </span>
          </button>
        </motion.div>

      </div>
    </div>
  )
}