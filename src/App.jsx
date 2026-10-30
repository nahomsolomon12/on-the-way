import { useEffect, useState } from 'react'
import './App.css'

const agePages = [26, 27, 28, 29, 30]

function pageFromHash() {
  const hash = window.location.hash.slice(1)
  if (hash === 'past' || hash === 'future' || hash === 'home') return hash
  const age = Number(hash.replace('future-', ''))
  return agePages.includes(age) ? `future-${age}` : 'home'
}

function App() {
  const [page, setPage] = useState(pageFromHash)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)

  useEffect(() => {
    function handleHashChange() {
      setPage(pageFromHash())
      setSelectedCard(null)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  function navigate(nextPage) {
    setPage(nextPage)
    setSelectedCard(null)
    setMenuOpen(false)
    window.location.hash = nextPage
  }

  function openCard(card) {
    setSelectedCard(card)
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button type="button" className="brand" onClick={() => navigate('home')} aria-label="Go to home">
          <span className="brand-mark">↗</span>
          <span>on the way</span>
        </button>

        <button
          type="button"
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
            type="button"
            className={page === 'past' ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate('past')}
          >
            <span className="nav-number">01</span>
            <span><strong>Past chapters</strong><small>Ages 20 — 25</small></span>
            <span className="nav-arrow">→</span>
          </button>
          <button
            type="button"
            className={page === 'future' || page.startsWith('future-') ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate('future')}
          >
            <span className="nav-number">02</span>
            <span><strong>Next chapter</strong><small>Ages 26 — 30</small></span>
            <span className="nav-arrow">→</span>
          </button>
        </nav>

      </aside>

      <section className="content">
        <header className="topbar">
          <div className="breadcrumb"><span>ON THE WAY</span>{page !== 'home' && <><i>/</i>{page === 'past' ? 'PAST CHAPTERS' : 'NEXT CHAPTER'}{page.startsWith('future-') && <><i>/</i>{page.replace('future-', 'AGE ')}</>}</>}{selectedCard && <><i>/</i>{selectedCard.title.toUpperCase()}</>}</div>
          <div className="topbar-actions"><button type="button" className="icon-button" aria-label="Notifications">♧</button><button type="button" className="share-button">Share journey <span>↗</span></button></div>
        </header>

        {selectedCard ? (
          <CardDetail card={selectedCard} onBack={() => setSelectedCard(null)} onParent={() => navigate(selectedCard.parent)} />
        ) : page === 'home' ? (
          <HomePage onNavigate={navigate} />
        ) : page === 'past' ? (
          <PastPage onContinue={() => navigate('future')} onOpenCard={openCard} />
        ) : page === 'future' ? (
          <FuturePage onOpenCard={openCard} onNavigate={navigate} />
        ) : (
          <AgePage age={Number(page.replace('future-', ''))} onOpenCard={openCard} onNavigate={navigate} />
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
        <button type="button" className="home-path-card past-path" onClick={() => onNavigate('past')}>
          <span className="card-index">01 / LOOKING BACK</span>
          <span className="path-icon">↙</span>
          <h3>Past chapters</h3>
          <p>Reflect on the spiritual, family, career, and side-project chapters that brought you here.</p>
          <span className="path-link">Enter ages 20 — 25 <b>→</b></span>
        </button>
        <button type="button" className="home-path-card future-path" onClick={() => onNavigate('future')}>
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

function CardDetail({ card, onBack, onParent }) {
  const [checkedItems, setCheckedItems] = useState({})

  function toggleSectionItem(sectionTitle, item) {
    const itemKey = `${sectionTitle}:${item}`
    setCheckedItems((checked) => ({ ...checked, [itemKey]: !checked[itemKey] }))
  }

  return (
    <div className="page card-detail-page">
      <button type="button" className="back-button" onClick={onBack}>← Back to {card.parent === 'past' ? 'Past chapters' : card.parent === 'future' ? 'Next chapter' : 'home'}</button>
      <div className="detail-heading">
        <span className="section-kicker">{card.eyebrow}</span>
        <span className="detail-icon">{card.icon}</span>
        <h2>{card.title}</h2>
        <p>{card.description}</p>
      </div>
      <div className="detail-divider" />
      <section className="detail-reflection">
        <span className="card-index">MAKE IT YOURS</span>
        <h3>{card.prompt || 'What does this mean for me right now?'}</h3>
        {card.sections ? (
          <div className="detail-sections">
            {card.sections.map((section) => (
              <section className="detail-section" key={section.title}>
                <div className="section-progress" aria-label={`${section.title} progress`}>
                  <span
                    className="section-progress-bar"
                    style={{ width: `${((section.items.filter((item) => checkedItems[`${section.title}:${item}`]).length) / section.items.length) * 100}%` }}
                  />
                </div>
                <h4>{section.title}</h4>
                <ul className="checklist">
                  {section.items.map((item) => {
                    const itemKey = `${section.title}:${item}`
                    return (
                      <li key={item}>
                        <label className={checkedItems[itemKey] ? 'checklist-item checked' : 'checklist-item'}>
                          <input
                            type="checkbox"
                            checked={Boolean(checkedItems[itemKey])}
                            onChange={() => toggleSectionItem(section.title, item)}
                          />
                          <span className="checklist-box" aria-hidden="true">✓</span>
                          <span>{item}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        ) : card.projects ? (
          <ol className="project-list" aria-label="Side projects in order of importance">
            {card.projects.map((project) => (
              <li key={project.name}>
                <strong>{project.name}</strong>
                {project.subProjects && (
                  <ul>
                    {project.subProjects.map((subProject) => <li key={subProject}>{subProject}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <div className="detail-writing-area" aria-label="Reflection space" />
        )}
      </section>
      <div className="page-footer">
        <span>DETAIL VIEW</span>
        <button type="button" className="primary-button" onClick={onParent}>Return to page <span>→</span></button>
      </div>
    </div>
  )
}

function PastPage({ onContinue, onOpenCard }) {
  return (
    <div className="page past-page">
      <div className="page-heading">
        <div><span className="section-kicker">LOOKING BACK · 20 — 25</span><h2>What brought me <em>here.</em></h2><p>Every chapter taught you something. Keep the wisdom, release the weight.</p></div>
        <div className="completion"><strong>04</strong><span>reflections<br />captured</span></div>
      </div>
      <div className="reflection-grid">
        <button type="button" className="reflection-card wide-card" onClick={() => onOpenCard({ parent: 'past', title: 'Spiritual', eyebrow: '01 / Spiritual', description: 'A place to reflect on faith, repentance, prayer, and the person I am becoming.', prompt: 'What have I learned?', icon: '✦' })}>
          <span className="card-index">01 / SPIRITUAL</span><span className="card-icon">✦</span>
          <h3>Spiritual</h3>
          <p className="quote">A place to reflect on faith, repentance, prayer, and the person I am becoming.</p>
          <div className="card-note"><span>↳</span> What have I learned?</div>
        </button>
        <button type="button" className="reflection-card" onClick={() => onOpenCard({ parent: 'past', title: 'Family: (chosen and blood)', eyebrow: '02 / Family', description: 'The relationships that shaped me and the people I choose to keep close.', prompt: 'What do I carry forward?', icon: '↗' })}>
          <span className="card-index">02 / FAMILY</span><span className="card-icon">↗</span>
          <h3>Family: (chosen and blood)</h3>
          <p className="quote">The relationships that shaped me and the people I choose to keep close.</p>
          <div className="card-note"><span>↳</span> What do I carry forward?</div>
        </button>
        <button type="button" className="reflection-card accent-card" onClick={() => onOpenCard({ parent: 'past', title: 'Career', eyebrow: '03 / Career', description: 'The work, lessons, and direction that helped me understand what matters.', prompt: 'What is next?', icon: '♡' })}>
          <span className="card-index">03 / CAREER</span><span className="card-icon">♡</span>
          <h3>Career</h3>
          <p className="quote">The work, lessons, and direction that helped me understand what matters.</p>
          <div className="card-note"><span>↳</span> What is next?</div>
        </button>
        <button type="button" className="reflection-card side-project-card" onClick={() => onOpenCard({ parent: 'past', title: 'Side projects', eyebrow: '04 / Side projects', description: 'The ideas and experiments that gave me room to explore, create, and grow.', prompt: 'What will I keep building?', icon: '☼' })}>
          <span className="card-index">04 / SIDE PROJECTS</span><span className="card-icon">☼</span>
          <h3>Side projects</h3>
          <p className="quote">The ideas and experiments that gave me room to explore, create, and grow.</p>
          <div className="card-note"><span>↳</span> What will I keep building?</div>
        </button>
      </div>
      <div className="page-footer"><span>01 — 02</span><button className="primary-button" onClick={onContinue}>Step into the next chapter <span>→</span></button></div>
    </div>
  )
}

function FuturePage({ onOpenCard, onNavigate, age = null }) {
  return (
    <div className="page future-page">
      {age && <button type="button" className="back-button age-back-button" onClick={() => onNavigate('future')}>← Back to Next chapter</button>}
      <div className="page-heading">
        <div className="axioms-heading-block">
          <span className="section-kicker">{age ? `NEXT CHAPTER · AGE ${age}` : 'LOOKING AHEAD · 26 — 30'}</span>
          <h2>Axioms</h2>
          <ol className="axioms-list">
            <li>Memento mori</li>
            <li>Act now: <strong>small</strong> action gets the ball rolling.</li>
            <li><strong>If</strong> you want a high quality &quot;product,&quot; lessen distractions on your plate.</li>
            <li>Remember people, mentors, and family (chosen and blood).</li>
          </ol>
        </div>
        <div className="year-badge"><span>{age ? 'CHAPTER' : 'MY NORTH STAR'}</span><strong>{age ? `AGE ${age}` : '2026 → 2030'}</strong></div>
      </div>
      <AgeNavigation currentAge={age} onNavigate={onNavigate} />
      <div className="commitments">
        <button type="button" className="commitment commitment-primary" onClick={() => onOpenCard({ parent: 'future', title: 'Spiritual', eyebrow: '01 / Spiritual', description: 'A commitment to true repentance and prayer, and to becoming the person I am called to be.', icon: '✦' })}>
          <div className="commitment-number">01</div>
          <div><span className="card-index">SPIRITUAL</span><h3>Spiritual</h3></div>
          <span className="commitment-mark">✦</span>
        </button>
        <button type="button" className="commitment commitment-secondary" onClick={() => onOpenCard({ parent: 'future', title: 'Family: (chosen and blood)', eyebrow: '02 / Family', description: 'Invest in family, both chosen and blood, by cultivating friendship, presence, and care.', icon: '↗' })}>
          <div className="commitment-number">02</div>
          <div><span className="card-index">FAMILY</span><h3>Family: (chosen and blood)</h3></div>
          <span className="commitment-mark">↗</span>
        </button>
        <button type="button" className="commitment commitment-tertiary" onClick={() => onOpenCard({ parent: 'future', title: 'Career', eyebrow: '03 / Career', description: 'Take responsibility for financial stability, keep moving toward a personal mission, and finish the work that has to get done.', icon: '♡' })}>
          <div className="commitment-number">03</div>
          <div><span className="card-index">CAREER</span><h3>Career</h3></div>
          <span className="commitment-mark">♡</span>
        </button>
        <button type="button" className="commitment commitment-quaternary" onClick={() => onOpenCard({
          parent: 'future',
          title: 'Side projects',
          eyebrow: '04 / Side projects',
          description: 'Keep making space for ideas, experiments, and the projects that help me grow.',
          icon: '☼',
          ...(age !== 26 && {
            projects: [
              { name: 'Running + ATG' },
              { name: 'Proverbs', subProjects: ['Speaking', 'Writing'] },
              { name: 'Church service' },
              { name: 'Building relationships' },
            ],
          }),
          ...(age === 26 && {
            sections: [
              { title: 'Hygiene habituality', items: ['Morning routine', 'Evening routine', 'Keep my space clean'] },
              { title: 'ATG basics', items: ['Strength training', 'Mobility practice', 'Track my progress'] },
              { title: 'Proverbs', items: ['Writing', 'Speaking to a camera'] },
            ],
          }),
        })}>
          <div className="commitment-number">04</div>
          <div><span className="card-index">SIDE PROJECTS</span><h3>Side projects</h3></div>
          <span className="commitment-mark">☼</span>
        </button>
      </div>
      <div className="page-footer"><span>02 — 02</span><span className="footer-message">You&apos;re already on your way <b>✦</b></span></div>
    </div>
  )
}

function AgePage({ age, onOpenCard, onNavigate }) {
  if (age === 26 || age === 30) {
    return <FuturePage age={age} onOpenCard={onOpenCard} onNavigate={onNavigate} />
  }

  return (
    <div className="page age-page">
      <button type="button" className="back-button" onClick={() => onNavigate('future')}>← Back to Next chapter</button>
      <div className="age-page-heading">
        <span className="section-kicker">NEXT CHAPTER · AGE {age}</span>
        <h2>Age <em>{age}.</em></h2>
        <p>This chapter is ready for you to define.</p>
      </div>
      <AgeNavigation currentAge={age} onNavigate={onNavigate} />
      <div className="age-writing-area" aria-label={`Reflection space for age ${age}`} />
    </div>
  )
}

function AgeNavigation({ currentAge, onNavigate }) {
  return (
    <nav className="age-navigation" aria-label="Next chapter ages">
      <span className="age-navigation-label">CHOOSE AN AGE</span>
      <div className="age-links">
        {agePages.map((age) => (
          <button
            type="button"
            className={currentAge === age ? 'age-link active' : 'age-link'}
            aria-current={currentAge === age ? 'page' : undefined}
            key={age}
            onClick={() => onNavigate(`future-${age}`)}
          >
            {age}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default App
