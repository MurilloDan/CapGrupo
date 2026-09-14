import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import './App.css'
import './routes.css'
import { companies, contact, gallery, group, milestones, pillars, processes, stats, zones } from './data'

const navItems = [['Nosotros', 'nosotros'], ['Empresas', 'empresas'], ['Cobertura', 'cobertura'], ['Equipo', 'equipo'], ['Trayectoria', 'trayectoria'], ['Contacto', 'contacto']]

const pad = (number) => String(number).padStart(2, '0')
const companyUrl = (company) => `/empresas/${company.slug}`
const telHref = (phone) => `tel:+504${phone.replace(/\D/g, '')}`
const mapsHref = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Tegucigalpa, Honduras`)}`
const external = { target: '_blank', rel: 'noreferrer' }

const splitWords = (children, state) => Children.map(children, (child) => {
  if (typeof child === 'string') {
    return child.split(/(\s+)/).filter(Boolean).map((part, index) => (/^\s+$/.test(part) ? part : <span className="word" key={index} style={{ '--i': state.i++ }}><span>{part}</span></span>))
  }
  if (isValidElement(child) && child.props.children) return cloneElement(child, undefined, splitWords(child.props.children, state))
  return child
})

function Words({ children }) {
  return <>{splitWords(children, { i: 0 })}</>
}

function TeamGallery() {
  const [open, setOpen] = useState(null)
  const closeRef = useRef(null)
  const total = gallery.length
  const move = (step) => setOpen((current) => (current + step + total) % total)

  useEffect(() => {
    if (open === null) return
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') setOpen((current) => (current + 1) % total)
      if (event.key === 'ArrowLeft') setOpen((current) => (current - 1 + total) % total)
    }
    document.body.classList.add('menu-open')
    closeRef.current?.focus()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [open, total])

  const photo = open === null ? null : gallery[open]

  return (
    <>
      <div className="team-gallery">
        {gallery.map((item, index) => (
          <figure className={`reveal ${item.layout}`} key={item.src} style={{ '--delay': `${index * 140}ms` }}>
            <button type="button" className="gallery-open" onClick={() => setOpen(index)} aria-label={`Ampliar foto: ${item.caption}`}>
              <img src={item.src} alt={item.alt} loading="lazy" style={{ objectPosition: item.position }} />
              <span className="gallery-zoom" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg></span>
            </button>
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
      {photo && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.caption} onClick={() => setOpen(null)}>
          <figure className="lightbox-figure" key={photo.src} onClick={(event) => event.stopPropagation()}>
            <img src={photo.src} alt={photo.alt} />
            <figcaption><span>{pad(open + 1)} / {pad(total)}</span>{photo.caption}</figcaption>
          </figure>
          <button type="button" className="lightbox-close" ref={closeRef} onClick={() => setOpen(null)} aria-label="Cerrar foto">×</button>
          <button type="button" className="lightbox-nav is-prev" onClick={(event) => { event.stopPropagation(); move(-1) }} aria-label="Foto anterior">←</button>
          <button type="button" className="lightbox-nav is-next" onClick={(event) => { event.stopPropagation(); move(1) }} aria-label="Foto siguiente">→</button>
        </div>
      )}
    </>
  )
}

const socials = [
  { key: 'instagram', label: 'Instagram', icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></> },
  { key: 'facebook', label: 'Facebook', icon: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z" /> },
  { key: 'tiktok', label: 'TikTok', icon: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.4 5 4.6" /> },
]

function SocialLinks({ className = '' }) {
  return (
    <ul className={`social-links ${className}`}>
      {socials.map(({ key, label, icon }) => (
        <li key={key}><a href={contact[key]} {...external} aria-label={`${label} de Grupo CAP`} title={label}><svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg></a></li>
      ))}
    </ul>
  )
}

const explorerFilters = ['Todas', 'B2B', 'B2C', 'Grupo']
const segmentOf = (company) => company.type.split(' · ')[1] ?? 'Grupo'

function CompanyExplorer() {
  const [filter, setFilter] = useState('Todas')
  const [activeSlug, setActiveSlug] = useState(companies[0].slug)
  const [paused, setPaused] = useState(false)
  const visible = companies.filter((company) => filter === 'Todas' || segmentOf(company) === filter)
  const current = visible.find((company) => company.slug === activeSlug) ?? visible[0]
  const position = visible.indexOf(current)
  const [label, segment] = current.type.split(' · ')
  const listRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    const item = list?.querySelector('.explorer-item.is-active')
    if (!item || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: item.offsetLeft - 12, behavior: 'smooth' })
  }, [current.slug])

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setTimeout(() => setActiveSlug(visible[(position + 1) % visible.length].slug), 6000)
    return () => clearTimeout(timer)
  }, [paused, position, visible])

  return (
    <div className="explorer reveal" data-paused={paused} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="explorer-nav">
        <div className="explorer-filters" role="group" aria-label="Filtrar empresas por segmento">
          {explorerFilters.map((option) => (
            <button type="button" key={option} className={option === filter ? 'is-active' : ''} aria-pressed={option === filter} onClick={() => setFilter(option)}>
              {option}<small>{option === 'Todas' ? companies.length : companies.filter((company) => segmentOf(company) === option).length}</small>
            </button>
          ))}
        </div>
        <div className="explorer-list" role="tablist" aria-label="Empresas del grupo" ref={listRef}>
          {visible.map((company) => {
            const isActive = company === current
            return (
              <button type="button" role="tab" aria-selected={isActive} key={company.slug} className={`explorer-item${isActive ? ' is-active' : ''}`} onClick={() => setActiveSlug(company.slug)}>
                <span className="explorer-index">{pad(companies.indexOf(company) + 1)}</span>
                <span className="explorer-logo"><img src={company.logo} alt="" loading="lazy" /></span>
                <span className="explorer-name">{company.name}<small>{company.type.split(' · ')[0]}</small></span>
                <span className="explorer-arrow" aria-hidden="true">→</span>
                {isActive && <span className="explorer-progress" key={`${company.slug}-${paused}`} aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </div>
      <article className="explorer-panel" role="tabpanel" key={current.slug} aria-live="polite">
        <div className="explorer-bar"><span className="status-dot" aria-hidden="true" /><span>CAP // Ecosistema</span><span>{pad(companies.indexOf(current) + 1)}/{pad(companies.length)}</span></div>
        <div className="explorer-body">
          <div className="explorer-visual" aria-hidden="true">
            <span className="explorer-ring" />
            <span className="explorer-hex"><img src={current.logo} alt="" /></span>
          </div>
          <div className="explorer-info">
            <div className="explorer-tags"><span className="explorer-segment">{segment ?? 'Grupo'}</span><span className="mini-label">{label}</span></div>
            <h3>{current.name}</h3>
            <p>{current.description ?? current.text}</p>
            {current.infrastructure && <ul className="explorer-stats">{current.infrastructure.map(([value, text]) => <li key={text}><b>{pad(value)}</b><span>{text}</span></li>)}</ul>}
            <div className="explorer-actions">
              <a className="button button-red" href={companyUrl(current)}>Conocer más <span aria-hidden="true">→</span></a>
              {current.website && <a className="button button-outline" href={current.website} {...external}>Sitio web <span aria-hidden="true">↗</span></a>}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

function CoverageZones() {
  const [active, setActive] = useState(null)
  const hub = zones.find((zone) => zone.hub)

  return (
    <div className="zones">
      <div className="zones-intro reveal">
        <span className="mini-label">Presencia nacional</span>
        <h3><Words>Zonas de cobertura</Words></h3>
        <p>Nuestras empresas operan a lo largo de todo Honduras, con infraestructura estratégicamente distribuida para garantizar presencia y servicio en las principales ciudades del país.</p>
        <ul className="zones-list">
          {zones.map((zone, index) => (
            <li key={zone.city} className={active === index ? 'is-active' : undefined} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)}>
              <b>{pad(index + 1)}</b><strong>{zone.city}</strong><span>{zone.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="zones-map reveal" role="img" aria-label={`Mapa de cobertura en Honduras: ${zones.map((zone) => zone.city).join(', ')}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {zones.filter((zone) => !zone.hub).map((zone) => (
            <line key={zone.city} x1={hub.x} y1={hub.y} x2={zone.x} y2={zone.y} className={active !== null && zones[active] === zone ? 'is-active' : undefined} />
          ))}
        </svg>
        {zones.map((zone, index) => (
          <span key={zone.city} className={`zone-pin${zone.hub ? ' is-hub' : ''}${zone.side === 'left' ? ' is-left' : ''}${active === index ? ' is-active' : ''}`} style={{ left: `${zone.x}%`, top: `${zone.y}%` }} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} aria-hidden="true">
            <i /><span>{zone.city}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const serviceIcons = {
  admin: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M8 13h8M8 16h5" /></>,
  finance: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M12 11v3" /></>,
  legal: <><path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z" /></>,
  logistics: <><path d="M21 8l-9-5-9 5v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8M7.5 5.5l9 5" /></>,
  tech: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  people: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" /></>,
}

const contactRowIcons = {
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  web: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  chat: <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3a8.5 8.5 0 1 1 15.5-4.6z" />,
}

const processIcons = [
  <g key="b2b"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></g>,
  <path key="counter" d="M4 10v10h16V10M3 10l2-6h14l2 6zM9 20v-6h6v6" />,
  <g key="delivery"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></g>,
  <path key="returns" d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5" />,
]

function ProcessGallery() {
  const [flipped, setFlipped] = useState([])
  const toggle = (index) => setFlipped((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]))

  return (
    <ol className="process-grid">
      {processes.map((process, index) => {
        const isFlipped = flipped.includes(index)
        return (
          <li
            className="process-flip reveal"
            data-flipped={isFlipped}
            key={process.title}
            role="button"
            tabIndex="0"
            aria-pressed={isFlipped}
            aria-label={`${process.title}: ${isFlipped ? 'ver información' : 'ver foto'}`}
            onClick={() => toggle(index)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return
              event.preventDefault()
              toggle(index)
            }}
          >
            <div className="process-inner">
              <div className="process-card" aria-hidden={isFlipped}>
                <div className="process-head">
                  <span className="process-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{processIcons[index]}</svg></span>
                  <span className="process-number" aria-hidden="true">{pad(index + 1)}</span>
                </div>
                <h4>{process.title}</h4>
                <p className="process-channel">{process.channel}</p>
                {process.steps
                  ? <ol className="steps">{process.steps.map((step, stepIndex) => <li key={step}><span className="step-index" aria-hidden="true">{stepIndex + 1}</span>{step}</li>)}</ol>
                  : <><p className="steps-label">Aplica por</p><ul className="steps reasons">{process.reasons.map((reason) => <li key={reason}><span className="step-index" aria-hidden="true" />{reason}</li>)}</ul></>}
                {process.phone && (
                  <a
                    className="process-phone"
                    href={telHref(process.phone)}
                    tabIndex={isFlipped ? -1 : undefined}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <span className="process-phone-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></span>
                    <span><small>Teléfono</small>+504 {process.phone}</span>
                  </a>
                )}
                <span className="process-flip-hint" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" /></svg>Ver foto</span>
              </div>
              <figure className="process-back" aria-hidden={!isFlipped}>
                <img src={process.image} alt={`Imagen de ${process.title}`} loading="lazy" />
                <figcaption>
                  <span>{pad(index + 1)}</span>
                  <strong>{process.title}</strong>
                  <small><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" /></svg>Volver</small>
                </figcaption>
              </figure>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

const coverageTotals = Object.entries(companies.flatMap((company) => company.infrastructure ?? []).reduce((totals, [value, label]) => {
  const key = label.split(' ')[0]
  totals[key] = (totals[key] ?? 0) + Number(value)
  return totals
}, {}))

const pillarIcons = [
  <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  <><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></>,
  <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" /></>,
  <><rect x="6" y="6" width="12" height="12" rx="1" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
]

const introSlides = [
  { src: '/images/intro/01-welmet.jpg', caption: 'Inversiones S&M' },
  { src: '/images/intro/02-aeromap.jpg', caption: 'Distribuidora Mansiago' },
  { src: '/images/intro/03-kyb.jpg', caption: 'Japan HN' },
  { src: '/images/intro/04-didasa.jpg', caption: 'Tecnicentro DIDASA' },
  { src: '/images/intro/05-tienda.jpg', caption: 'Atención al cliente' },
  { src: '/images/intro/06-grupo-cap.jpg', caption: 'Un solo grupo' },
]

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const introSeen = () => {
  if (new URLSearchParams(window.location.search).has('intro')) return reducedMotion()
  try {
    return sessionStorage.getItem('cap-intro') === '1' || reducedMotion()
  } catch {
    return false
  }
}

function Intro() {
  const [phase, setPhase] = useState(() => (introSeen() ? 'done' : 'play'))
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const replay = () => {
      if (reducedMotion()) return
      setIndex(0)
      setPhase('play')
    }
    window.addEventListener('cap:intro', replay)
    return () => window.removeEventListener('cap:intro', replay)
  }, [])

  useEffect(() => {
    if (phase !== 'play') return
    const timer = setTimeout(() => (index < introSlides.length - 1 ? setIndex(index + 1) : setPhase('logo')), 950)
    return () => clearTimeout(timer)
  }, [phase, index])

  useEffect(() => {
    const next = { logo: ['exit', 1900], exit: ['done', 900] }[phase]
    if (!next) return
    const timer = setTimeout(() => setPhase(next[0]), next[1])
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    const done = phase === 'done'
    document.body.classList.toggle('intro-lock', !done)
    if (done) {
      try { sessionStorage.setItem('cap-intro', '1') } catch { /* sin almacenamiento */ }
      if (window.location.search.includes('intro')) window.history.replaceState(null, '', window.location.pathname + window.location.hash)
    }
  }, [phase])

  if (phase === 'done') return null

  return (
    <div className={`intro is-${phase}`} role="dialog" aria-label="Presentación de Grupo CAP">
      <div className="intro-slides" aria-hidden="true">
        {introSlides.map((slide, slideIndex) => (
          <figure key={slide.src} className={`intro-slide${slideIndex === index ? ' is-active' : ''}${slideIndex < index ? ' is-past' : ''}`}>
            <img src={slide.src} alt="" />
          </figure>
        ))}
      </div>
      <div className="intro-hud" aria-hidden="true">
        <span className="intro-count">{pad(index + 1)} <small>/ {pad(introSlides.length)}</small></span>
        <strong className="intro-caption" key={index}>{introSlides[index].caption}</strong>
        <span className="intro-progress"><span style={{ transform: `scaleX(${(index + 1) / introSlides.length})` }} /></span>
      </div>
      <div className="intro-logo">
        <img src="/logos/cap-intro.png" alt="Grupo CAP" />
        <span className="intro-tagline">La movilidad mueve el progreso</span>
      </div>
      <button type="button" className="intro-skip" onClick={() => setPhase('done')}>Saltar intro <span aria-hidden="true">→</span></button>
    </div>
  )
}

function useReveal(key) {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal:not(.is-visible)')
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [key])
}

function Header({ home = true }) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const base = home ? '' : '/'

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > 24)
      setHidden(y > lastY + 4 && y > 480)
      if (y < lastY - 4 || y <= 480) setHidden(false)
      lastY = y
      headerRef.current?.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!home || !('IntersectionObserver' in window)) return
    const sections = navItems.map(([, id]) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id))
    }, { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach((section) => observer.observe(section))
    const onTop = () => window.scrollY < 200 && setActive('')
    window.addEventListener('scroll', onTop, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onTop)
    }
  }, [home])

  useEffect(() => {
    if (!open) return
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth > 960 && setOpen(false)
    document.body.classList.add('menu-open')
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header ref={headerRef} className={`nav${scrolled || open ? ' is-solid' : ''}${open ? ' is-open' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
      <span className="nav-progress" aria-hidden="true" />
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="nav-inner wrap">
        <a
          className="brand"
          href={home ? '#inicio' : '/?intro'}
          aria-label="Grupo CAP, ir al inicio"
          onClick={(event) => {
            if (!home) return
            event.preventDefault()
            setOpen(false)
            window.scrollTo({ top: 0, behavior: 'instant' })
            window.dispatchEvent(new Event('cap:intro'))
          }}
        >
          <img className="logo-white" src="/logos/cap-blanco.png" alt="" width="112" height="47" />
          <img className="logo-color" src="/logos/cap.png" alt="" width="112" height="47" />
        </a>
        <nav id="menu-principal" className="nav-links" aria-label="Principal">
          {navItems.map(([label, id]) => <a key={id} href={`${base}#${id}`} className={active === id ? 'is-active' : undefined} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
          <div className="nav-mobile-extra">
            <a className="button button-red" href={contact.whatsapp} {...external}>Escríbenos por WhatsApp <span aria-hidden="true">↗</span></a>
            <SocialLinks />
          </div>
        </nav>
        <div className="nav-actions">
          <SocialLinks className="is-nav" />
          <a className="nav-cta" href={contact.whatsapp} {...external}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3a8.5 8.5 0 1 1 15.5-4.6z" /><path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l1-1.6-2-1-1 1a4 4 0 0 1-2.4-2.4l1-1-1-2z" /></svg>
            WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="menu-principal" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen((value) => !value)}><span /><span /></button>
      </div>
    </header>
  )
}

function Stat({ value, suffix = '', label }) {
  const ref = useRef(null)
  const [animate] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window)
  const [shown, setShown] = useState(animate ? 0 : value)

  useEffect(() => {
    if (!animate) return
    let frame
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - start) / 1400, 1)
        setShown(Math.round(value * (1 - (1 - progress) ** 3)))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [animate, value])

  return <div className="stat" ref={ref}><strong aria-label={`${value}${suffix}`}>{pad(shown)}{suffix}</strong><span>{label}</span></div>
}

function SectionLabel({ number, children }) {
  return <div className="section-label reveal"><span>{number}</span><span>{children}</span></div>
}

function Footer({ home = true }) {
  const base = home ? '' : '/'
  return (
    <footer className="footer">
      <div className="footer-inner wrap">
        <div className="footer-brand">
          <img src="/logos/cap-blanco.png" alt="Grupo CAP" width="130" height="55" loading="lazy" />
          <p>Conglomerado empresarial hondureño dedicado al sector automotriz, con cobertura nacional y un compromiso inquebrantable con la excelencia.</p>
        </div>
        <div className="footer-col"><span className="mini-label">Empresas</span>{companies.map((company) => <a key={company.slug} href={companyUrl(company)}>{company.name}</a>)}</div>
        <div className="footer-col"><span className="mini-label">Navegación</span>{navItems.map(([label, id]) => <a key={id} href={`${base}#${id}`}>{label}</a>)}</div>
        <div className="footer-col"><span className="mini-label">Síguenos</span><SocialLinks className="is-dark" /><a href={contact.instagram} {...external}>Instagram ↗</a><a href={contact.facebook} {...external}>Facebook ↗</a><a href={contact.tiktok} {...external}>TikTok ↗</a><a href={contact.whatsapp} {...external}>WhatsApp ↗</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Grupo Empresarial CAP</span><span>{contact.city}</span></div>
      </div>
    </footer>
  )
}

function CompanyPage({ company }) {
  useReveal(company.slug)
  useEffect(() => { document.title = `${company.name} · Grupo CAP` }, [company])
  const others = companies.filter((item) => item.slug !== company.slug)

  return (
    <div className="site-shell company-page">
      <Header home={false} />
      <main id="contenido">
        <section className="detail-hero">
          <div className="detail-hero-inner wrap">
            <div className="detail-copy reveal">
              <a className="back-link" href="/#empresas"><span aria-hidden="true">←</span> Todas las empresas</a>
              <p className="eyebrow">Empresa del Grupo CAP</p>
              <h1><Words>{company.name}</Words></h1>
              <p className="detail-type">{company.type}</p>
              <p>{company.description ?? company.text} Somos parte del ecosistema de Grupo Empresarial CAP.</p>
              <div className="hero-actions">
                {company.website && <a className="button button-red" href={company.website} {...external}>Visitar sitio oficial <span aria-hidden="true">↗</span></a>}
                {company.contact
                  ? <a className="button button-ghost" href={telHref(company.contact.phone)}>Llamar {company.contact.phone} <span aria-hidden="true">↗</span></a>
                  : <a className="button button-ghost" href={contact.whatsapp} {...external}>Contactar <span aria-hidden="true">↗</span></a>}
              </div>
            </div>
            <div className="detail-logo reveal"><img src={company.logo} alt={`Logo de ${company.name}`} /></div>
          </div>
          <div className="wrap">
            <dl className="detail-summary">
              <div><dt>Parte de</dt><dd>Grupo Empresarial CAP</dd></div>
              <div><dt>Cobertura</dt><dd>Nacional</dd></div>
              <div><dt>Segmento</dt><dd>{company.type}</dd></div>
            </dl>
          </div>
        </section>

        {company.description && (
          <section className="section wrap">
            <SectionLabel number="01">Perfil de la empresa</SectionLabel>
            <div className={`detail-profile${company.infrastructure ? '' : ' is-single'}`}>
              <div className="reveal">
                <p className="lead">{company.description}</p>
                <span className="mini-label">{company.highlightsTitle}</span>
                <ul className="check-list">{company.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              {company.infrastructure && (
                <div className="reveal">
                  <span className="mini-label">Infraestructura</span>
                  <ul className="infra-cards">{company.infrastructure.map(([value, label]) => <li key={label}><strong>{value}</strong><span>{label}</span></li>)}</ul>
                </div>
              )}
            </div>
            {company.mission && (
              <div className="mission-grid">
                <article className="reveal"><span className="mini-label">Misión</span><p>{company.mission}</p></article>
                <article className="reveal"><span className="mini-label">Visión</span><p>{company.vision}</p></article>
              </div>
            )}
            {company.list && (
              <div className="detail-list reveal">
                <span className="mini-label">{company.listTitle}</span>
                <ul className="tag-list">{company.list.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            )}
            <div className="detail-contact-card reveal">
              <div>
                <span className="mini-label">{company.contact.address ? 'Visítanos' : 'Contáctanos'}</span>
                {company.contact.address && <address>{company.contact.address}</address>}
                <p className="contact-meta"><a href={telHref(company.contact.phone)}>Tel. {company.contact.phone}</a><a href={`mailto:${company.contact.email}`}>{company.contact.email.split('@')[0]}@<wbr />{company.contact.email.split('@')[1]}</a></p>
              </div>
              {company.contact.address
                ? <a className="button button-light" href={mapsHref(company.contact.address)} {...external}>Cómo llegar <span aria-hidden="true">↗</span></a>
                : <a className="button button-light" href={company.website} {...external}>Visitar sitio <span aria-hidden="true">↗</span></a>}
            </div>
          </section>
        )}

        <section className="section wrap">
          <SectionLabel number="+">Otras empresas del grupo</SectionLabel>
          <ul className="others-grid">
            {others.map((item) => (
              <li className="reveal" key={item.slug}>
                <a href={companyUrl(item)}>
                  <span className="others-logo"><img src={item.logo} alt="" loading="lazy" /></span>
                  <span><strong>{item.name}</strong><small>{item.type}</small></span>
                  <span className="arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="dark-section detail-cta">
          <div className="section wrap reveal">
            <span className="mini-label">Conoce más</span>
            <h2 className="display"><Words>La movilidad<br /><em>nos conecta.</em></Words></h2>
            <p>Descubre cómo cada empresa del grupo aporta una solución especializada y complementaria para nuestros clientes.</p>
            <a className="button button-light" href="/#contacto">Contactar a Grupo CAP <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>
      <Footer home={false} />
    </div>
  )
}

function HomePage() {
  useReveal('home')

  return (
    <div className="site-shell">
      <Header />
      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="hero-content">
            <p className="eyebrow"><span className="status-dot" aria-hidden="true" />Conglomerado empresarial de Honduras</p>
            <h1><Words>Impulsamos la <em>movilidad</em> que mueve el progreso.</Words></h1>
            <p className="hero-copy">Un grupo. Una visión. Todas las soluciones para el sector automotriz: importación, distribución, venta al detalle, servicio y logística.</p>
            <div className="hero-actions">
              <a className="button button-red" href="#empresas">Conoce nuestras empresas <span aria-hidden="true">↓</span></a>
              <a className="button button-ghost" href="#contacto">Conversemos <span aria-hidden="true">↗</span></a>
            </div>
            <dl className="hero-data">{stats.slice(0, 3).map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd>{String(stat.value).padStart(2, '0')}{stat.suffix}</dd></div>)}</dl>
          </div>
          <div className="hero-media">
            <img src="/images/equipo-grupo-cap.jpg" alt="Equipo de Grupo CAP frente al logo corporativo" fetchPriority="high" />
            <span className="hud-scan" aria-hidden="true" />
            <span className="hud hud-tl" aria-hidden="true" /><span className="hud hud-tr" aria-hidden="true" /><span className="hud hud-bl" aria-hidden="true" /><span className="hud hud-br" aria-hidden="true" />
            <p className="hud-tag" aria-hidden="true"><span className="status-dot" />Grupo CAP // Equipo</p>
          </div>
        </section>

        <section className="brands" aria-label="Empresas del grupo">
          <div className="brands-inner wrap">
            <p className="brands-label">Empresas<br />del grupo</p>
            <div className="brands-marquee">
              <ul className="brands-list">
                {[...companies, ...companies].map((company, index) => {
                  const copy = index >= companies.length
                  return <li key={`${company.slug}-${index}`} aria-hidden={copy || undefined}><a href={companyUrl(company)} title={company.name} tabIndex={copy ? -1 : undefined}><img src={company.logo} alt={copy ? '' : company.name} /></a></li>
                })}
              </ul>
            </div>
          </div>
        </section>

        <section className="stats wrap" aria-label="Grupo CAP en cifras">{stats.map((stat) => <Stat key={stat.label} {...stat} />)}</section>

        <section className="section wrap" id="nosotros">
          <SectionLabel number="01">Quiénes somos</SectionLabel>
          <div className="about-grid">
            <div className="about-text reveal">
              <p>{group.traits}</p>
              <div className="services">
                <span className="mini-label">Funciones que centralizamos</span>
                <ul className="services-grid">{group.sharedServices.map(({ label, icon }, index) => <li key={label}><span className="service-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{serviceIcons[icon]}</svg></span><span className="service-text"><small>{String(index + 1).padStart(2, '0')}</small>{label}</span></li>)}</ul>
              </div>
              <a className="text-link" href="#pilares">Nuestra forma de hacer las cosas <span aria-hidden="true">↗</span></a>
            </div>
            <figure className="about-media reveal">
              <img src="/images/equipo-oficina.jpg" alt="Parte del equipo de Grupo CAP en las oficinas corporativas" loading="lazy" />
              <figcaption><strong>160+</strong><span>Colaboradores comprometidos</span></figcaption>
            </figure>
          </div>
          <div className="about-heading reveal">
            <div>
              <h2 className="display"><Words>Un solo grupo.<br /><em>Un gran movimiento.</em></Words></h2>
              <div className="red-rule" />
            </div>
            <div>
              <p className="lead">{group.lead.split('Centro de Servicios Compartidos').map((part, index) => index ? <span key={index}><strong>Centro de Servicios Compartidos</strong>{part}</span> : part)}</p>
              <div className="members">
                <span className="mini-label">Empresas que integran el grupo</span>
                <ul className="members-list">{group.members.map((slug) => companies.find((company) => company.slug === slug)).map((company) => (
                  <li key={company.slug}><a href={companyUrl(company)}><span className="members-logo"><img src={company.logo} alt="" loading="lazy" /></span>{company.name}<span className="members-arrow" aria-hidden="true">→</span></a></li>
                ))}</ul>
              </div>
            </div>
          </div>
          <div className="purpose">
          <div className="mission-grid">
            <article className="reveal"><span className="mini-label">Nuestra misión</span><p>{group.mission}</p></article>
            <article className="reveal"><span className="mini-label">Nuestra visión</span><p>{group.vision}</p></article>
          </div>
          <blockquote className="belief reveal"><p>En CAP creemos que <em>la movilidad mueve el progreso</em>, por eso trabajamos para garantizar que cada vehículo en Honduras tenga acceso a repuestos y servicios confiables, seguros y de alto rendimiento.</p></blockquote>
          <figure className="purpose-photo reveal"><img src="/images/colaboradora.png" alt="Colaboradora de Grupo CAP con tableta en mano" loading="lazy" /></figure>
          </div>
        </section>

        <section className="dark-section" id="pilares">
          <div className="section wrap">
            <SectionLabel number="02">Estrategia corporativa</SectionLabel>
            <div className="section-heading reveal"><h2 className="display"><Words>La dirección<br /><em>es clara.</em></Words></h2><p>Cinco pilares que convierten nuestra visión en decisiones, acciones y resultados.</p></div>
            <div className="pillar-hive">
              <div className="hex hex-core reveal"><div className="hex-inner"><img src="/logos/cap.png" alt="Grupo CAP" /></div></div>
              <div className="hex hex-summary hex-pos-6 reveal" aria-hidden="true"><div className="hex-inner"><strong>{pad(pillars.length)}</strong><span>Pilares estratégicos</span></div></div>
              {pillars.map(([title, text], index) => (
                <article className={`hex hex-pillar hex-pos-${index + 1} reveal`} key={title}>
                  <div className="hex-inner">
                    <span className="pillar-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{pillarIcons[index]}</svg></span>
                    <span className="pillar-step">{pad(index + 1)}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section wrap" id="empresas">
          <SectionLabel number="03">Portafolio corporativo</SectionLabel>
          <div className="section-heading reveal"><h2 className="display"><Words>Siete empresas.<br /><em>Una misma energía.</em></Words></h2><p>Un ecosistema especializado que cubre toda la cadena de valor del sector automotriz hondureño, además del alquiler de maquinaria pesada para construcción.</p></div>
          <CompanyExplorer />
        </section>

        <section className="dark-section" id="cobertura">
          <div className="section wrap">
            <SectionLabel number="04">Cobertura y procesos</SectionLabel>
            <div className="section-heading reveal"><h2 className="display"><Words>Cobertura nacional<br /><em>completa.</em></Words></h2><p>Atendemos clientes a lo largo de todo el país con vendedores, bodegas, talleres y tiendas distribuidas estratégicamente.</p></div>
            <dl className="coverage-totals reveal">
              {coverageTotals.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{pad(value)}</dd></div>)}
            </dl>
            <ul className="network-list">
              {companies.filter((company) => company.infrastructure).map((company) => {
                const [label, segment] = company.type.split(' · ')
                return (
                  <li className="network-card reveal" key={company.slug}>
                    <a className="network-head" href={companyUrl(company)}>
                      <span className="network-logo"><img src={company.logo} alt="" loading="lazy" /></span>
                      <span><strong>{company.name}</strong><small>{label}</small></span>
                      {segment && <span className="network-segment">{segment}</span>}
                    </a>
                    <ul className="infra">{company.infrastructure.map(([value, text]) => <li key={text}><b>{pad(value)}</b><span>{text}</span></li>)}</ul>
                  </li>
                )
              })}
            </ul>
            <CoverageZones />
            <h3 className="subheading reveal"><Words>Procesos clave del Grupo CAP</Words></h3>
            <ProcessGallery />
          </div>
        </section>

        <section className="team" id="equipo">
          <div className="section wrap">
            <SectionLabel number="05">Nuestro equipo</SectionLabel>
            <div className="section-heading reveal"><h2 className="display"><Words>Personas que<br /><em>mueven el grupo.</em></Words></h2><p>Detrás de cada pieza entregada y cada vehículo atendido hay un equipo comprometido con la calidad y el servicio.</p></div>
            <TeamGallery />
          </div>
        </section>

        <section className="timeline" id="trayectoria">
          <div className="section wrap">
            <SectionLabel number="06">Nuestra historia</SectionLabel>
            <div className="section-heading reveal"><h2 className="display"><Words>De dónde venimos<br /><em>define a dónde vamos.</em></Words></h2><p>Desde nuestra fundación, cada paso ha sido un avance estratégico hacia la consolidación del sector automotriz hondureño.</p></div>
            <ol className="timeline-list">{milestones.map(([year, title, text, logos]) => <li className="reveal" key={year}><span className="timeline-year">{year}</span><span className="timeline-logos">{logos.map(([name, src]) => <span className="timeline-logo" key={name} title={name}><img src={src} alt={name} loading="lazy" /></span>)}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
          </div>
        </section>

        <section className="future">
          <img className="future-image" src="/images/equipo-almacen.jpg" alt="" loading="lazy" />
          <div className="future-copy wrap reveal">
            <span className="mini-label">Visión de futuro</span>
            <h2 className="display"><Words>Construimos hoy<br />el sector de <em>mañana.</em></Words></h2>
            <p>Con una estrategia clara de expansión, innovación tecnológica y desarrollo de talento humano, Grupo CAP se posiciona como el conglomerado automotriz de referencia en Centroamérica.</p>
            <a className="button button-light" href="#contacto">Hablemos de futuro <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="section wrap" id="contacto">
          <SectionLabel number="07">Contacto corporativo</SectionLabel>
          <div className="contact-grid">
            <figure className="contact-photo reveal">
              <span className="contact-photo-hex" aria-hidden="true" />
              <img src="/images/colaborador-carga.png" alt="Colaborador de Grupo CAP transportando cajas con carretilla" loading="lazy" />
              <figcaption className="contact-photo-tag"><span className="status-dot" aria-hidden="true" />Cobertura nacional</figcaption>
            </figure>
            <div className="contact-intro reveal">
              <h2 className="display"><Words>Conectemos<br /><em>juntos.</em></Words></h2>
              <p>Si deseas conocer más sobre nuestro grupo, explorar alianzas estratégicas o contactar a alguna de nuestras empresas, estamos a tu disposición.</p>
              <div className="hero-actions">
                <a className="button button-red" href={contact.whatsapp} {...external}>Escríbenos por WhatsApp <span aria-hidden="true">↗</span></a>
                <a className="button button-outline" href={`tel:${contact.phoneHref}`}>Llamar <span aria-hidden="true">↗</span></a>
              </div>
              <div className="contact-social"><span className="mini-label">Síguenos en redes</span><SocialLinks /></div>
            </div>
            <dl className="contact-details reveal">
              <div><dt><span className="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg></span>Sede corporativa</dt><dd>{contact.city}</dd></div>
              <div><dt><span className="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></span>Llámanos</dt><dd><a href={`tel:${contact.phoneHref}`}>{contact.phone}</a></dd></div>
              <div><dt><span className="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg></span>Escríbenos</dt><dd><a href={`mailto:${contact.email}`}>{contact.email.split('@')[0]}@<wbr />{contact.email.split('@')[1]}</a></dd></div>
              <div><dt><span className="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span>Horario</dt><dd>{contact.hours}</dd></div>
              <div><dt><span className="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 10h.01M15 10h.01" /></svg></span>Dirección</dt><dd><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}`} {...external}>{contact.address}</a></dd></div>
            </dl>
          </div>
          <div className="contact-map reveal">
            <iframe title={`Mapa: ${contact.address}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&z=16&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="contact-map-bar">
              <span className="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg></span>
              <div><span className="mini-label">Sede corporativa</span><strong>{contact.address}</strong></div>
              <a className="button button-red" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}`} {...external}>Abrir en Maps <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <h3 className="subheading reveal"><Words>Contacto de nuestras empresas</Words></h3>
          <ul className="contacts-grid">
            {companies.filter((company) => company.contact || ['cap-logistics', 'inversiones-marlon'].includes(company.slug)).map((company) => (
              <li className={`contact-card reveal${company.contact ? '' : ' is-pending'}`} key={company.slug}>
                <div className="contact-card-head">
                  <a className="contacts-logo" href={companyUrl(company)} aria-label={`Ver ${company.name}`}><img src={company.logo} alt="" loading="lazy" /></a>
                  <div>
                    <strong>{company.name}</strong>
                    <span className="contact-card-type">{company.type.split(' · ')[0]}</span>
                  </div>
                </div>
                <ul className="contact-rows">
                  {company.contact ? (
                    <>
                      <li>
                        <span className="contact-row-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{company.contact.address ? contactRowIcons.pin : contactRowIcons.web}</svg></span>
                        {company.contact.address
                          ? <address>{company.contact.address}</address>
                          : <a className="contact-line" href={company.website} {...external}>{company.website?.replace('https://', '')} ↗</a>}
                      </li>
                      <li><span className="contact-row-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{contactRowIcons.phone}</svg></span><a className="contact-line" href={telHref(company.contact.phone)}>Tel. {company.contact.phone}</a></li>
                      <li><span className="contact-row-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{contactRowIcons.mail}</svg></span><a className="contact-line" href={`mailto:${company.contact.email}`}>{company.contact.email.split('@')[0]}@<wbr />{company.contact.email.split('@')[1]}</a></li>
                    </>
                  ) : (
                    <>
                      <li><span className="contact-row-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{contactRowIcons.pin}</svg></span><address>Información de contacto próximamente</address></li>
                      <li><span className="contact-row-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{contactRowIcons.chat}</svg></span><a className="contact-line" href={contact.whatsapp} {...external}>Escríbenos por WhatsApp ↗</a></li>
                    </>
                  )}
                </ul>
                <a className="contact-card-more" href={companyUrl(company)}>Ver empresa <span aria-hidden="true">→</span></a>
              </li>
            ))}
          </ul>
          <div className="careers reveal">
            <img className="careers-mark" src="/logos/cap-intro.png" alt="" aria-hidden="true" loading="lazy" />
            <div className="careers-copy">
              <img className="careers-logo" src="/logos/cap-intro.png" alt="Grupo CAP" loading="lazy" />
              <span className="mini-label">Talento CAP</span>
              <h3><Words>¿Deseas trabajar con nosotros?</Words></h3>
              <p>Súmate a un equipo que impulsa la movilidad en Honduras. Consulta nuestras vacantes disponibles y conoce más de nuestra cultura en LinkedIn.</p>
            </div>
            <div className="careers-actions">
              <a className="button button-light" href={contact.recruit} {...external}>Ver vacantes <span aria-hidden="true">↗</span></a>
              <a className="button button-ghost" href={contact.linkedin} {...external}>
                <svg className="careers-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></svg>
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  const company = companies.find((item) => path === companyUrl(item))
  return company ? <CompanyPage company={company} /> : <><Intro /><HomePage /></>
}
