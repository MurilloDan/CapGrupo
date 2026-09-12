import './App.css'
import './routes.css'

const companies = [
  { name: 'Inversiones S&M', slug: 'inversiones-sm', type: 'Importación y distribución B2B', text: 'Autopartes, atención especializada y cobertura nacional para talleres, distribuidores y flotillas.', mark: 'S&M', className: 'company-sm', website: 'https://www.inversionessymhn.com' },
  { name: 'Distribuidora Mansiago', slug: 'distribuidora-mansiago', type: 'Lubricantes y autopartes B2B', text: 'Lubricantes, fluidos y filtros de calidad con una respuesta ágil para cada operación.', mark: 'M', className: 'company-mansiago', website: 'https://www.mansiago.com' },
  { name: 'Auto Repuestos Blessing', slug: 'auto-repuestos-blessing', type: 'Venta al detalle B2C', text: 'Variedad, precios accesibles y servicio a domicilio para mover cada día mejor.', mark: 'B', className: 'company-blessing', website: 'https://autorepuestosblessing.com' },
  { name: 'Tecnicentro DIDASA', slug: 'tecnicentro-didasa', type: 'Instalación y servicio automotriz', text: 'Diagnóstico electrónico, mecánica general y técnicos que conocen tu vehículo.', mark: 'D', className: 'company-didasa' },
  { name: 'Japan HN', slug: 'japan-hn', type: 'Repuestos japoneses B2B', text: 'Calidad japonesa garantizada en marcas y piezas para el mercado hondureño.', mark: 'JH', className: 'company-japan', website: 'https://www.japanhn.com' },
  { name: 'CAP Logistics', slug: 'cap-logistics', type: 'Logística especializada', text: 'La cadena de suministro del grupo, conectando cada punto con eficiencia.', mark: 'CAP', className: 'company-logistics' },
]

const pillars = [
  ['01', 'Sostenibilidad financiera', 'Crecimiento rentable y una gestión estratégica de recursos que fortalece cada decisión.'],
  ['02', 'Expansión comercial', 'Más presencia, mejores alianzas y un portafolio que llega donde el mercado lo necesita.'],
  ['03', 'Excelencia operativa', 'Procesos precisos para lograr la calidad y los tiempos de respuesta que nos diferencian.'],
  ['04', 'Experiencia del cliente', 'Cada contacto cuenta: escuchamos, resolvemos y construimos relaciones duraderas.'],
  ['05', 'Transformación digital', 'Tecnología e innovación para modernizar operaciones y liderar el sector.'],
]

function CompanyPage({ company }) {
  return (
    <div className="company-page site-shell">
      <header className="nav company-nav"><a className="brand" href="/"><span>CAP</span><small>GRUPO EMPRESARIAL</small></a><a className="nav-cta" href="/">Volver al grupo <span>↩</span></a></header>
      <main>
        <section className={`company-detail-hero ${company.className}`}><div className="company-detail-art"><span>{company.mark}</span></div><div className="company-detail-copy"><span className="eyebrow">EMPRESA DEL GRUPO CAP</span><h1>{company.name}</h1><p className="detail-type">{company.type}</p><p>{company.text} Somos parte de un ecosistema que impulsa la movilidad y el crecimiento del sector automotriz en Honduras.</p><div className="detail-actions"><a className="button button-light" href="/#empresas">Ver todas las empresas <span>↩</span></a>{company.website && <a className="button button-outline" href={company.website} target="_blank" rel="noreferrer">Visitar sitio oficial <span>↗</span></a>}</div></div></section>
        <section className="detail-summary"><div><span className="mini-label">PARTE DE</span><strong>Grupo Empresarial CAP</strong></div><div><span className="mini-label">COBERTURA</span><strong>Honduras y región</strong></div><div><span className="mini-label">ENFOQUE</span><strong>{company.type}</strong></div></section>
        <section className="detail-contact"><span className="mini-label">CONOCE MÁS</span><h2>La movilidad<br /><em>nos conecta.</em></h2><p>Descubre cómo cada empresa del grupo aporta una solución especializada y complementaria para nuestros clientes.</p><a className="text-link" href="/#contacto">Contactar a Grupo CAP <span>↗</span></a></section>
      </main>
    </div>
  )
}

function App() {
  const routeCompany = companies.find((company) => window.location.pathname === `/empresas/${company.slug}`)
  if (routeCompany) return <CompanyPage company={routeCompany} />

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const navItems = [['Nosotros', 'nosotros'], ['Pilares', 'pilares'], ['Empresas', 'empresas'], ['Trayectoria', 'trayectoria'], ['Contacto', 'contacto']]

  return (
    <div className="site-shell">
      <header className="nav">
        <button className="brand" onClick={() => scrollTo('inicio')} aria-label="Ir al inicio"><span>CAP</span><small>GRUPO EMPRESARIAL</small></button>
        <nav>{navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</nav>
        <button className="nav-cta" onClick={() => scrollTo('contacto')}>Conversemos <span>↗</span></button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-image" /><div className="hero-overlay" />
          <div className="hero-content"><p className="eyebrow">CONGLOMERADO EMPRESARIAL DE HONDURAS</p><h1>Impulsamos la <em>movilidad</em> que mueve el progreso.</h1><p className="hero-copy">Un grupo. Una visión. Todas las soluciones para el sector automotriz.</p><button className="button button-light" onClick={() => scrollTo('empresas')}>Conoce nuestro grupo <span>↓</span></button></div>
          <div className="hero-bottom"><span>01 — 06</span><span>Desliza para descubrir</span><span className="scroll-line" /></div>
        </section>

        <section className="stats"><div><strong>06</strong><span>Empresas del grupo</span></div><div><strong>57+</strong><span>Colaboradores</span></div><div><strong>06</strong><span>Departamentos</span></div><div><strong>08</strong><span>Años consolidando</span></div></section>

        <section className="about section" id="nosotros"><div className="section-label"><span>01</span><span>QUIÉNES SOMOS</span></div><div className="about-grid"><div><h2>Un solo grupo.<br /><em>Un gran movimiento.</em></h2><div className="red-rule" /></div><div className="about-text"><p className="lead">Somos un grupo empresarial sólido conformado por empresas especializadas en el sector automotriz, con cobertura nacional y un compromiso inquebrantable con la excelencia.</p><p>Desde la importación y distribución de autopartes hasta la logística y el servicio especializado, construimos soluciones que hacen avanzar a nuestros clientes y al país.</p><button className="text-link" onClick={() => scrollTo('pilares')}>Nuestra forma de hacer las cosas <span>↗</span></button></div></div><div className="mission-grid"><article><span className="mini-label">NUESTRA MISIÓN</span><p>Ser aliados estratégicos del rubro automotriz, brindando productos y servicios de calidad que apoyen el crecimiento de nuestros clientes.</p></article><article><span className="mini-label">NUESTRA VISIÓN</span><p>Ser líderes en el mercado nacional y regional, reconocidos por la excelencia, la innovación y la expansión continua.</p></article></div></section>

        <section className="pillars section dark-section" id="pilares"><div className="section-label"><span>02</span><span>ESTRATEGIA CORPORATIVA</span></div><div className="section-heading"><h2>La dirección es clara.</h2><p>Cinco pilares que convierten nuestra visión en decisiones, acciones y resultados.</p></div><div className="pillar-list">{pillars.map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><b>↗</b></article>)}</div></section>

        <section className="companies section" id="empresas"><div className="section-label"><span>03</span><span>PORTAFOLIO CORPORATIVO</span></div><div className="section-heading"><h2>Seis empresas.<br /><em>Una misma energía.</em></h2><p>Un ecosistema especializado que cubre toda la cadena de valor del sector automotriz hondureño.</p></div><div className="company-grid">{companies.map((company, index) => <article className={`company-card ${company.className}`} key={company.name}><div className="company-visual"><span className="company-mark">{company.mark}</span><span className="company-number">0{index + 1}</span></div><div className="company-info"><span className="mini-label">{company.type}</span><h3>{company.name}</h3><p>{company.text}</p><a className="company-route" href={`/empresas/${company.slug}`} aria-label={`Conocer ${company.name}`}>↗</a></div></article>)}</div></section>

        <section className="timeline section" id="trayectoria"><div className="section-label"><span>04</span><span>NUESTRA HISTORIA</span></div><div className="section-heading"><h2>De dónde venimos<br /><em>define a dónde vamos.</em></h2><p>Desde nuestra fundación, cada paso ha sido un avance estratégico hacia la consolidación del sector automotriz hondureño.</p></div><div className="timeline-list">{[['2018', 'Fundación', 'Nace Grupo Empresarial CAP con la visión de consolidar el sector automotriz hondureño.'], ['2021', 'Expansión B2B', 'Inversiones S&M y Distribuidora Mansiago inician operaciones a nivel nacional.'], ['2022', 'Canal B2C', 'Auto Repuestos Blessing abre sus puertas al público con tiendas de venta al detalle.'], ['2025', 'Servicios', 'Tecnicentro DIDASA se incorpora al grupo con talleres de instalación y mantenimiento.'], ['2026', 'Consolidación', 'Más empresas, más talento y cobertura nacional completa.']].map(([year, title, text], index) => <article key={year}><span>{year}</span><div className="timeline-dot">{String(index + 1).padStart(2, '0')}</div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

        <section className="future"><div className="future-image" /><div className="future-copy"><span className="mini-label">VISIÓN DE FUTURO</span><h2>Construimos hoy<br />el sector de <em>mañana.</em></h2><p>Con una estrategia clara de expansión, innovación tecnológica y desarrollo de talento humano, Grupo CAP se posiciona como el conglomerado automotriz de referencia en Centroamérica.</p><button className="button button-light" onClick={() => scrollTo('contacto')}>Hablemos de futuro <span>↗</span></button></div></section>

        <section className="contact section" id="contacto"><div className="section-label"><span>05</span><span>CONTACTO CORPORATIVO</span></div><div className="contact-grid"><div><h2>Conectemos<br /><em>juntos.</em></h2><p>Si deseas conocer más sobre nuestro grupo, explorar alianzas estratégicas o contactar a alguna de nuestras empresas, estamos a tu disposición.</p></div><div className="contact-details"><div><span>SEDE CORPORATIVA</span><strong>Tegucigalpa, Honduras</strong></div><div><span>LLÁMANOS</span><a href="tel:+50499900823">+504 9990-0823</a></div><div><span>ESCRÍBENOS</span><a href="mailto:administracion@inversionessymhn.com">administracion@inversionessymhn.com</a></div><div><span>HORARIO</span><strong>Lunes a viernes · 8:00 AM — 5:00 PM</strong></div></div></div></section>
      </main>

      <footer><div className="footer-brand"><span>CAP</span><p>Conglomerado empresarial hondureño dedicado al sector automotriz, con cobertura nacional y un compromiso inquebrantable con la excelencia.</p></div><div className="footer-links"><div><span className="mini-label">NAVEGACIÓN</span><button onClick={() => scrollTo('inicio')}>Inicio</button><button onClick={() => scrollTo('nosotros')}>Nosotros</button><button onClick={() => scrollTo('empresas')}>Empresas</button></div><div><span className="mini-label">SÍGUENOS</span><a href="https://www.instagram.com/grupocap" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.facebook.com/GrupoCAP" target="_blank" rel="noreferrer">Facebook ↗</a></div></div><div className="footer-bottom"><span>© 2026 Grupo Empresarial CAP</span><span>Tegucigalpa, Honduras</span><a className="whatsapp" href="https://wa.me/50499900823" target="_blank" rel="noreferrer">WhatsApp ↗</a></div></footer>
    </div>
  )
}

export default App
