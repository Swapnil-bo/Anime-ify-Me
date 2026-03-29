import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputForm from './components/InputForm'
import LoadingScreen from './components/LoadingScreen'
import AnimeCard from './components/AnimeCard'

// ─── State Machine ────────────────────────────────────────────────────────────
const STATE = {
  IDLE:    'idle',
  LOADING: 'loading',
  RESULT:  'result',
  ERROR:   'error',
}

// ─── Particle System ──────────────────────────────────────────────────────────
// Floating crimson/gold embers that drift upward in the background
function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Spawn a small pool of drifting embers
    const particles = Array.from({ length: 28 }, () => spawnParticle(canvas))

    function spawnParticle(canvas, atBottom = false) {
      const colors = [
        'rgba(230, 57, 70,',   // crimson
        'rgba(255, 214, 10,',  // gold
        'rgba(76, 201, 240,',  // blue — rare
      ]
      const color = Math.random() < 0.6
        ? colors[0]
        : Math.random() < 0.8 ? colors[1] : colors[2]

      return {
        x:       Math.random() * canvas.width,
        y:       atBottom ? canvas.height + 10 : Math.random() * canvas.height,
        size:    Math.random() * 1.5 + 0.4,
        speedY:  -(Math.random() * 0.4 + 0.15),
        speedX:  (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.35 + 0.05,
        flicker: Math.random() * Math.PI * 2,
        color,
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.y       += p.speedY
        p.x       += p.speedX
        p.flicker += 0.04
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.flicker))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${alpha.toFixed(2)})`
        ctx.fill()

        // Respawn when drifted off-screen
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          particles[i] = spawnParticle(canvas, true)
        }
      })

      animId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  )
}

// ─── Animated Header ──────────────────────────────────────────────────────────
function AppHeader({ appState }) {
  const isCompact = appState !== STATE.IDLE

  return (
    <motion.header
      className="relative z-10 text-center overflow-hidden"
      animate={{
        paddingTop:    isCompact ? '1.5rem' : '3.5rem',
        paddingBottom: isCompact ? '1rem'   : '2rem',
      }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Japanese subtitle line */}
      <motion.div
        className="inline-flex items-center gap-3 mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <motion.div
          className="h-px"
          style={{ background: 'linear-gradient(to right, transparent, var(--crimson))' }}
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />
        <span
          className="font-noto-jp text-xs"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.4em' }}
        >
          アニメ・キャラクター
        </span>
        <motion.div
          className="h-px"
          style={{ background: 'linear-gradient(to left, transparent, var(--crimson))' }}
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />
      </motion.div>

      {/* Main title — letter-by-letter reveal */}
      <motion.h1
        className="font-cinzel-deco"
        style={{
          fontSize:             isCompact ? 'clamp(1.4rem, 3vw, 2rem)' : 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight:           900,
          letterSpacing:        '0.1em',
          background:           'linear-gradient(135deg, #ffffff 0%, #ffd60a 40%, #e63946 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip:       'text',
          backgroundSize:       '250% auto',
          animation:            'nameShimmer 5s linear infinite',
          transition:           'font-size 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        Anime-ify Me
      </motion.h1>

      {/* Tagline — only visible in idle state */}
      <AnimatePresence>
        {appState === STATE.IDLE && (
          <motion.p
            className="font-rajdhani text-xs tracking-widest uppercase mt-2"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.35em' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            Describe yourself. Become legend.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Local AI status badge */}
      <motion.div
        className="flex justify-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5"
          style={{
            border:     '1px solid rgba(46, 196, 182, 0.15)',
            background: 'rgba(46, 196, 182, 0.04)',
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: 'var(--sage)' }}
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ background: 'var(--sage)' }}
            />
          </span>
          <span
            className="font-rajdhani text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'rgba(46, 196, 182, 0.65)', letterSpacing: '0.2em' }}
          >
            Mistral 7B · Local · No API Keys
          </span>
        </div>
      </motion.div>
    </motion.header>
  )
}

// ─── Error Screen ─────────────────────────────────────────────────────────────
function ErrorScreen({ error, onReset, onRetry }) {
  return (
    <motion.div
      className="glass-panel p-10 text-center relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{   opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    >
      <span className="bracket-tl" /><span className="bracket-tr" />
      <span className="bracket-bl" /><span className="bracket-br" />

      {/* Kanji: 失敗 = failure */}
      <motion.div
        className="font-noto-jp mb-5"
        style={{ fontSize: '4rem', color: 'var(--crimson)', opacity: 0.25 }}
        initial={{ opacity: 0, scale: 1.3 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        失敗
      </motion.div>

      <motion.p
        className="font-cinzel text-sm mb-2 tracking-widest uppercase"
        style={{ color: 'rgba(232,232,240,0.35)', letterSpacing: '0.3em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        The Forge Has Failed
      </motion.p>

      <motion.p
        className="font-noto-jp text-sm mb-8 mx-auto"
        style={{
          color:     'var(--crimson)',
          opacity:   0.75,
          fontStyle: 'italic',
          maxWidth:  '380px',
          lineHeight: 1.7,
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 0.75, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {error}
      </motion.p>

      <motion.div
        className="flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button className="btn-ghost" onClick={onReset}>
          <span>← New Description</span>
        </button>
        <button className="btn-forge" onClick={onRetry}>
          <span>Retry Forge</span>
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Page Transition Variants ─────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -12, filter: 'blur(4px)' },
}

const pageTransition = {
  duration: 0.45,
  ease: [0.19, 1, 0.22, 1],
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [appState,   setAppState]   = useState(STATE.IDLE)
  const [character,  setCharacter]  = useState(null)
  const [error,      setError]      = useState(null)
  const [description, setDescription] = useState('')

  // Dismiss HTML preloader after first real React paint
  useEffect(() => {
    if (typeof window.dismissPreloader === 'function') {
      window.dismissPreloader()
    }
  }, [])

  const handleSubmit = async (desc) => {
    setDescription(desc)
    setAppState(STATE.LOADING)
    setError(null)
    setCharacter(null)

    try {
      const res = await fetch('/api/animify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ description: desc }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Something went wrong. Try again.')
      }

      setCharacter(data.character)
      setAppState(STATE.RESULT)

    } catch (err) {
      setError(err.message)
      setAppState(STATE.ERROR)
    }
  }

  const handleReset  = () => { setAppState(STATE.IDLE);   setCharacter(null); setError(null) }
  const handleRetry  = () => { if (description) handleSubmit(description) }

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--void)' }}>

      {/* ── Atmospheric layers ── */}
      <Particles />
      <div className="fixed inset-0 bg-dot-grid pointer-events-none" style={{ opacity: 0.5, zIndex: 1 }} />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex:     1,
          background: 'radial-gradient(ellipse 90% 55% at 50% 20%, rgba(230,57,70,0.05) 0%, transparent 70%)',
        }}
      />
      {/* Bottom fade to void */}
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 1,
          height: '200px',
          background: 'linear-gradient(to top, var(--void), transparent)',
        }}
      />

      {/* ── Main content ── */}
      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 2 }}>

        <AppHeader appState={appState} />

        {/* Divider */}
        <AnimatePresence>
          {appState === STATE.IDLE && (
            <motion.div
              className="px-6 max-w-2xl mx-auto w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="divider-blade">
                <span className="divider-kanji">魂 · 力 · 剣</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── State machine views ── */}
        <main className="flex-1 px-6 pb-20 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">

            {appState === STATE.IDLE && (
              <motion.div
                key="idle"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <InputForm onSubmit={handleSubmit} />
              </motion.div>
            )}

            {appState === STATE.LOADING && (
              <motion.div
                key="loading"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <LoadingScreen />
              </motion.div>
            )}

            {appState === STATE.RESULT && character && (
              <motion.div
                key="result"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <AnimeCard character={character} onReset={handleReset} />
              </motion.div>
            )}

            {appState === STATE.ERROR && (
              <motion.div
                key="error"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <ErrorScreen
                  error={error}
                  onReset={handleReset}
                  onRetry={handleRetry}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer
          className="text-center pb-8 px-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '1.5rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p
            className="font-rajdhani text-xs tracking-widest"
            style={{ color: 'var(--text-ghost)', letterSpacing: '0.25em' }}
          >
            POWERED BY MISTRAL 7B · OLLAMA · FULLY LOCAL · NO DATA LEAVES YOUR MACHINE
          </p>
        </motion.footer>

      </div>
    </div>
  )
}