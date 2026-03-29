import { useState, useEffect } from 'react'
import InputForm from './components/InputForm'
import LoadingScreen from './components/LoadingScreen'
import AnimeCard from './components/AnimeCard'

// App states — explicit state machine, no boolean soup
const STATE = {
  IDLE:    'idle',
  LOADING: 'loading',
  RESULT:  'result',
  ERROR:   'error',
}

export default function App() {
  const [appState, setAppState]     = useState(STATE.IDLE)
  const [character, setCharacter]   = useState(null)
  const [error, setError]           = useState(null)
  const [description, setDescription] = useState('')

  // Dismiss the HTML preloader after first real React paint
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc }),
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

  const handleReset = () => {
    setAppState(STATE.IDLE)
    setCharacter(null)
    setError(null)
  }

  const handleRetry = () => {
    if (description) handleSubmit(description)
  }

  return (
    <div className="min-h-screen bg-void relative">

      {/* Ambient background — dot grid + speed lines layered */}
      <div className="fixed inset-0 bg-dot-grid opacity-60 pointer-events-none" />
      <div className="fixed inset-0 bg-speed-lines opacity-40 pointer-events-none" />

      {/* Radial gradient — draws eye to center */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(230,57,70,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Main layout */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <header className="pt-12 pb-6 px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="h-px w-12"
              style={{ background: 'linear-gradient(to right, transparent, var(--crimson))' }}
            />
            <span
              className="font-noto-jp text-xs tracking-widest"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.4em' }}
            >
              アニメ・キャラクター
            </span>
            <div
              className="h-px w-12"
              style={{ background: 'linear-gradient(to left, transparent, var(--crimson))' }}
            />
          </div>

          <h1
            className="font-cinzel-deco text-glow-crimson mb-2"
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '0.1em',
              background: 'linear-gradient(135deg, #ffffff 0%, #ffd60a 40%, #e63946 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Anime-ify Me
          </h1>

          <p
            className="font-rajdhani text-sm tracking-widest uppercase"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.3em' }}
          >
            Forge your anime identity
          </p>

          {/* Powered by local AI badge */}
          <div className="flex justify-center mt-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1"
              style={{
                border: '1px solid rgba(46, 196, 182, 0.15)',
                background: 'rgba(46, 196, 182, 0.04)',
              }}
            >
              {/* Pulsing green dot — "live" indicator */}
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                  style={{ background: 'var(--sage)' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: 'var(--sage)' }}
                />
              </span>
              <span
                className="font-rajdhani text-xs font-600 tracking-widest uppercase"
                style={{ color: 'rgba(46, 196, 182, 0.7)', letterSpacing: '0.2em' }}
              >
                Mistral 7B · Running Locally · No API Keys
              </span>
            </div>
          </div>
        </header>

        {/* Divider */}
        <div className="px-6 max-w-2xl mx-auto w-full">
          <div className="divider-blade">
            <span className="divider-kanji">魂</span>
          </div>
        </div>

        {/* Content area — state machine renders correct view */}
        <main className="flex-1 px-6 pb-16 max-w-2xl mx-auto w-full">

          {appState === STATE.IDLE && (
            <InputForm onSubmit={handleSubmit} />
          )}

          {appState === STATE.LOADING && (
            <LoadingScreen />
          )}

          {appState === STATE.RESULT && character && (
            <AnimeCard
              character={character}
              onReset={handleReset}
            />
          )}

          {appState === STATE.ERROR && (
            <div className="glass-panel p-8 text-center animate-fade-in">
              {/* Corner brackets */}
              <span className="bracket-tl" />
              <span className="bracket-tr" />
              <span className="bracket-bl" />
              <span className="bracket-br" />

              {/* Error kanji */}
              <div
                className="font-noto-jp mb-4"
                style={{ fontSize: '3rem', color: 'var(--crimson)', opacity: 0.4 }}
              >
                失敗
              </div>

              <p
                className="font-noto-jp text-sm mb-2"
                style={{ color: 'rgba(232, 232, 240, 0.5)' }}
              >
                The forge has failed.
              </p>
              <p
                className="font-rajdhani text-sm mb-8"
                style={{
                  color: 'var(--crimson)',
                  opacity: 0.8,
                  fontStyle: 'italic',
                  maxWidth: '360px',
                  margin: '0 auto 2rem',
                  lineHeight: 1.6,
                }}
              >
                {error}
              </p>

              <div className="flex items-center justify-center gap-4">
                <button className="btn-ghost" onClick={handleReset}>
                  <span>← New Description</span>
                </button>
                <button className="btn-forge" onClick={handleRetry}>
                  <span>Retry Forge</span>
                </button>
              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer
          className="text-center pb-8 px-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '1.5rem' }}
        >
          <p
            className="font-rajdhani text-xs tracking-widest"
            style={{ color: 'var(--text-ghost)', letterSpacing: '0.25em' }}
          >
            POWERED BY MISTRAL 7B · OLLAMA · FULLY LOCAL · NO DATA LEAVES YOUR MACHINE
          </p>
        </footer>

      </div>
    </div>
  )
}