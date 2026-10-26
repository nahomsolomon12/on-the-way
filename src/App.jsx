import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage('home')} aria-label="Go to home">
          <span className="brand-mark">↗</span>
          <span>on the way</span>
        </button>

        <button
          className="mobile-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="journey-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>Journey pages</span>
          <span className="hamburger-icon" aria-hidden="true">
            {menuOpen ? '×' : '☰'}
          </span>
        </button>
        <nav
          id="journey-navigation"
          className={menuOpen ? 'journey-nav open' : 'journey-nav'}
          aria-label="Journey pages"
        >
          <button
            className={page === 'past' ? 'nav-item active' : 'nav-item'}
            onClick={() => {
              setPage('past')
              setMenuOpen(false)
            }}
          >
            <span className="nav-number">01</span>
            <span><strong>Past chapters</strong><small>Ages 20 — 25</small></span>
            <span className="nav-arrow">→</span>
          </button>
          <button
            className={page === 'future' ? 'nav-item active' : 'nav-item'}
            onClick={() => {
              setPage('future')
              setMenuOpen(false)
            }}
          >
            <span className="nav-number">02</span>
            <span><strong>Next chapter</strong><small>Ages 26 — 30</small></span>
            <span className="nav-arrow">→</span>
          </button>
        </nav>

      </aside>

      <section className="content">
        <header className="topbar">
          <div className="breadcrumb"><span>ON THE WAY</span>{page !== 'home' && <><i>/</i>{page === 'past' ? 'PAST CHAPTERS' : 'NEXT CHAPTER'}</>}</div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Notifications">♧</button><button className="share-button">Share journey <span>↗</span></button></div>
        </header>

        {page === 'home' ? (
          <HomePage onNavigate={setPage} />
        ) : page === 'past' ? (
          <PastPage onContinue={() => setPage('future')} />
        ) : (
          <FuturePage />
        )}
      </section>
    </main>
  )
}

function HomePage({ onNavigate }) {
  return (
    <div className="page home-page">
      <div className="home-heading">
        <span className="section-kicker">WELCOME TO YOUR JOURNEY</span>
        <h2>Keep moving<br /><em>on the way.</em></h2>
        <p>A place to honor what shaped you, and make space for what comes next.</p>
      </div>
      <div className="home-path">
        <button className="home-path-card past-path" onClick={() => onNavigate('past')}>
          <span className="card-index">01 / LOOKING BACK</span>
          <span className="path-icon">↙</span>
          <h3>Past chapters</h3>
          <p>Reflect on the spiritual, family, career, and side-project chapters that brought you here.</p>
          <span className="path-link">Enter ages 20 — 25 <b>→</b></span>
        </button>
        <button className="home-path-card future-path" onClick={() => onNavigate('future')}>
          <span className="card-index">02 / LOOKING AHEAD</span>
          <span className="path-icon">↗</span>
          <h3>Next chapter</h3>
          <p>Hold your axioms and major goals close as you move through ages 26 — 30.</p>
          <span className="path-link">Enter ages 26 — 30 <b>→</b></span>
        </button>
      </div>
      <div className="home-note"><span>✦</span> There is no perfect pace. There is only the next honest step.</div>
    </div>
  )
}

function PastPage({ onContinue }) {
  return (
    <div className="page past-page">
      <div className="page-heading">
        <div><span className="section-kicker">LOOKING BACK · 20 — 25</span><h2>What brought me <em>here.</em></h2><p>Every chapter taught you something. Keep the wisdom, release the weight.</p></div>
        <div className="completion"><strong>04</strong><span>reflections<br />captured</span></div>
      </div>
      <div className="reflection-grid">
        <article className="reflection-card wide-card">
          <span className="card-index">01 / SPIRITUAL</span><span className="card-icon">✦</span>
          <h3>Spiritual</h3>
          <p className="quote">A place to reflect on faith, repentance, prayer, and the person I am becoming.</p>
          <div className="card-note"><span>↳</span> What have I learned?</div>
        </article>
        <article className="reflection-card">
          <span className="card-index">02 / FAMILY</span><span className="card-icon">↗</span>
          <h3>Family: (chosen and blood)</h3>
          <p className="quote">The relationships that shaped me and the people I choose to keep close.</p>
          <div className="card-note"><span>↳</span> What do I carry forward?</div>
        </article>
        <article className="reflection-card accent-card">
          <span className="card-index">03 / CAREER</span><span className="card-icon">♡</span>
          <h3>Career</h3>
          <p className="quote">The work, lessons, and direction that helped me understand what matters.</p>
          <div className="card-note"><span>↳</span> What is next?</div>
        </article>
        <article className="reflection-card side-project-card">
          <span className="card-index">04 / SIDE PROJECTS</span><span className="card-icon">☼</span>
          <h3>Side projects</h3>
          <p className="quote">The ideas and experiments that gave me room to explore, create, and grow.</p>
          <div className="card-note"><span>↳</span> What will I keep building?</div>
        </article>
      </div>
      <div className="page-footer"><span>01 — 02</span><button className="primary-button" onClick={onContinue}>Step into the next chapter <span>→</span></button></div>
    </div>
  )
}

function FuturePage() {
  return (
    <div className="page future-page">
      <div className="page-heading">
        <div className="axioms-heading-block">
          <span className="section-kicker">LOOKING AHEAD · 26 — 30</span>
          <h2>Axioms</h2>
          <ol className="axioms-list">
            <li>Memento mori</li>
            <li>Act now: <strong>small</strong> action gets the ball rolling.</li>
            <li><strong>If</strong> you want a high quality &quot;product,&quot; lessen distractions on your plate.</li>
            <li>Remember people, mentors, and family (chosen and blood).</li>
          </ol>
        </div>
        <div className="year-badge"><span>MY NORTH STAR</span><strong>2026 → 2030</strong></div>
      </div>
      <div className="commitments">
        <article className="commitment commitment-primary">
          <div className="commitment-number">01</div>
          <div><span className="card-index">SPIRITUAL</span><h3>Spiritual</h3></div>
          <span className="commitment-mark">✦</span>
        </article>
        <article className="commitment commitment-secondary">
          <div className="commitment-number">02</div>
          <div><span className="card-index">FAMILY</span><h3>Family: (chosen and blood)</h3></div>
          <span className="commitment-mark">↗</span>
        </article>
        <article className="commitment commitment-tertiary">
          <div className="commitment-number">03</div>
          <div><span className="card-index">CAREER</span><h3>Career</h3></div>
          <span className="commitment-mark">♡</span>
        </article>
        <article className="commitment commitment-quaternary">
          <div className="commitment-number">04</div>
          <div><span className="card-index">SIDE PROJECTS</span><h3>Side projects</h3></div>
          <span className="commitment-mark">☼</span>
        </article>
      </div>
      <div className="page-footer"><span>02 — 02</span><span className="footer-message">You&apos;re already on your way <b>✦</b></span></div>
    </div>
  )
}

export default App
