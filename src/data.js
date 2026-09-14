const B = import.meta.env.BASE_URL

export const contact = {
  city: 'Tegucigalpa, Honduras',
  address: 'Bulevar Comunidad Económica Europea, frente a Plaza Aire Frío, Tegucigalpa, Honduras',
  mapQuery: 'Plaza Aire Frío, Bulevar Comunidad Económica Europea, Tegucigalpa',
  phone: '+504 9990-0823',
  phoneHref: '+50499900823',
  email: 'administracion@inversionessymhn.com',
  hours: 'Lunes a viernes · 8:00 AM — 5:00 PM',
  whatsapp: 'https://wa.me/50499900823',
  instagram: 'https://www.instagram.com/grupoempresarialcap/',
  facebook: 'https://www.facebook.com/invrcastro/',
  tiktok: 'https://www.tiktok.com/@capgrupo',
  recruit: 'https://recruit.capgrupo.com/',
  linkedin: 'https://www.linkedin.com/company/caphn/posts/?feedView=all',
}

export const group = {
  lead: 'CAP es el Centro de Servicios Compartidos del Holding Grupo Castro: un corporativo que centraliza y profesionaliza la gestión de nuestras empresas automotrices.',
  traits: 'Nos caracteriza la amplia cobertura nacional, un portafolio completo de autopartes y servicios, procesos eficientes, precios competitivos y un compromiso inquebrantable con la calidad, la innovación y la satisfacción del cliente.',
  sharedServices: [
    { label: 'Administración', icon: 'admin' },
    { label: 'Finanzas', icon: 'finance' },
    { label: 'Legal', icon: 'legal' },
    { label: 'Logística', icon: 'logistics' },
    { label: 'Tecnología', icon: 'tech' },
    { label: 'Talento humano', icon: 'people' },
  ],
  members: ['inversiones-sm', 'auto-repuestos-blessing', 'tecnicentro-didasa', 'distribuidora-mansiago', 'cap-logistics', 'soluciones-marlons'],
  mission: 'Ser aliados estratégicos del rubro automotriz, brindando productos y servicios de calidad que apoyen el crecimiento de nuestros clientes mediante atención profesional, excelencia operativa y soluciones integrales.',
  vision: 'Ser líderes en el mercado nacional y regional, reconocidos por la excelencia en productos y servicios, altos estándares de calidad, precios competitivos y la expansión continua del grupo.',
}

export const companies = [
  {
    name: 'Inversiones S&M', slug: 'inversiones-sm', type: 'Importación y distribución · B2B', logo: B + 'logos/sym.jpg', website: 'https://www.inversionessymhn.com',
    text: 'Importación y distribución de autopartes con cobertura nacional para talleres, distribuidores y flotillas.',
    description: 'Inversiones S&M es una empresa líder en importación y distribución de autopartes en Honduras, enfocada en el mercado B2B.',
    highlightsTitle: 'Ofrecemos',
    highlights: ['Servicio personalizado y confiable', 'Cobertura nacional', 'Entregas rápidas y abastecimiento oportuno', 'Atención a talleres, distribuidores y flotillas'],
    infrastructure: [['2', 'Bodegas'], ['6', 'Vendedores con cobertura nacional']],
    mission: 'Ser el socio estratégico del sector automotriz, ofreciendo autopartes de alta calidad, precios competitivos y asesoría especializada que impulse el crecimiento de nuestros clientes.',
    vision: 'Consolidarnos como la distribuidora de autopartes más confiable y reconocida del país, destacando por nuestro servicio excepcional, innovación constante y compromiso con el desarrollo automotriz.',
    contact: { address: 'Bulevar Comunidad Económica Europea, frente a Plaza Aire Frío', phone: '9990-0823', email: 'administracion@inversionessymhn.com' },
  },
  {
    name: 'Distribuidora Mansiago', slug: 'distribuidora-mansiago', type: 'Lubricantes, fluidos y autopartes · B2B', logo: B + 'logos/mansiago.jpg', website: 'https://www.mansiago.com',
    text: 'Lubricantes, fluidos, filtros, baterías y autopartes de calidad con respuesta inmediata.',
    description: 'Distribuidora Mansiago se especializa en lubricantes, fluidos, filtros, baterías y autopartes de calidad.',
    highlightsTitle: 'Nos caracteriza',
    highlights: ['Confiabilidad', 'Excelencia en el servicio', 'Atención orientada al cliente', 'Respuesta inmediata con infraestructura eficiente'],
    infrastructure: [['2', 'Bodegas'], ['6', 'Vendedores con cobertura nacional']],
    mission: 'Revolucionar la industria automotriz hondureña, garantizando el máximo rendimiento de cada vehículo mediante productos de alta calidad y un servicio al cliente inigualable.',
    vision: 'Convertirnos en el líder indiscutible de la industria de repuestos en Honduras, estableciendo el estándar de calidad, asequibilidad y satisfacción del cliente.',
    contact: { address: 'Bulevar Comunidad Económica Europea, frente a Plaza Aire Frío', phone: '9408-4995', email: 'administracion@mansiago.com' },
  },
  {
    name: 'Auto Repuestos Blessing', slug: 'auto-repuestos-blessing', type: 'Venta al detalle · B2C', logo: B + 'logos/blessing.png', website: 'https://autorepuestosblessing.com',
    text: 'Referente nacional en autopartes al detalle: amplia variedad, precios accesibles y servicio a domicilio.',
    description: 'Auto Repuestos Blessing es referente nacional en la venta de autopartes al detalle, reconocido por su amplia variedad, precios accesibles y calidad.',
    highlightsTitle: 'Brindamos',
    highlights: ['Amplio inventario', 'Servicio a domicilio', 'Atención personalizada en tiendas', 'Productos para múltiples marcas'],
    infrastructure: [['2', 'Tiendas'], ['12', 'Vendedores'], ['10', 'Conserjes de orden y soporte interno']],
    mission: 'Brindar productos de alta calidad y un servicio excepcional que garantice la satisfacción y fidelidad de nuestros clientes.',
    vision: 'Posicionarnos como líderes en Honduras y expandirnos en Centroamérica, siendo la opción preferida para la compra de repuestos.',
    listTitle: 'Principales líneas de venta',
    list: ['Lubricantes', 'Filtros', 'Fricciones', 'Dirección', 'Amortiguadores', 'Motores', 'Embragues', 'Soportes'],
    contact: { address: 'Col. Kennedy, frente al Instituto Técnico Honduras', phone: '3285-0830', email: 'gerencia@autorepuestosblessing.com' },
  },
  {
    name: 'Tecnicentro DIDASA', slug: 'tecnicentro-didasa', type: 'Instalación y servicio · B2C', logo: B + 'logos/didasa.jpg',
    text: 'Mantenimiento, reparación, instalación y venta de autopartes con técnicos profesionales.',
    description: 'Tecnicentro y Repuestos DIDASA es un centro integral de mantenimiento, reparación, instalación y venta de autopartes.',
    highlightsTitle: 'Nos distingue',
    highlights: ['Servicio accesible y confiable', 'Compromiso con cada cliente', 'Técnicos profesionales', 'Atención garantizada'],
    infrastructure: [['3', 'Talleres'], ['10', 'Técnicos altamente capacitados']],
    mission: 'Transformar la experiencia automotriz mediante un servicio integral, de calidad garantizada y atención oportuna.',
    vision: 'Ser el centro automotriz preferido por su calidad, accesibilidad e innovación en servicios.',
    listTitle: 'Servicios principales',
    list: ['Cambio de lubricantes y fluidos', 'Cambio de pastillas y zapatas', 'Rectificado de discos y tambores', 'Cambio de clutch', 'Alineamiento y balanceo', 'Limpieza de inyectores', 'Diagnóstico electrónico', 'Mecánica general', 'Carga de A/C', 'Sistema de enfriamiento', 'Rectificado de muñones'],
    contact: { address: 'Anillo Periférico, Villa Nueva (100 m antes del puente peatonal)', phone: '8944-9954', email: 'gerencia@tecdidasa.co' },
  },
  { name: 'Japan HN', slug: 'japan-hn', type: 'Repuestos japoneses · B2B', logo: B + 'logos/japan-hn.jpg', website: 'https://www.japanhn.com', text: 'Calidad japonesa garantizada en marcas y piezas para el mercado hondureño.' },
  { name: 'CAP Logistics', slug: 'cap-logistics', type: 'Logística especializada', logo: B + 'logos/cap.png', text: 'La cadena de suministro del grupo, conectando cada punto con eficiencia.' },
  {
    name: 'Soluciones Marlons', slug: 'soluciones-marlons', type: 'Renta de maquinaria pesada', logo: B + 'logos/marlon.png', website: 'https://solucionesmarlons.com',
    text: 'Soluciones Marlons: renta de equipo amarillo para excavación, carga y compactación en proyectos de construcción.',
    description: 'Soluciones Marlons ofrece maquinaria y soluciones operativas: renta de equipo amarillo en Honduras para apertura de terreno, movimiento de material y preparación de bases en obra.',
    highlightsTitle: 'Servicios',
    highlights: ['Renta para excavación: apertura de terreno, zanjeo y nivelación', 'Movimiento de material: carga y traslado en frentes de trabajo', 'Preparación de base: compactación de rellenos, accesos y superficies', 'Apoyo a proyectos especiales'],
    listTitle: 'Equipos disponibles',
    list: ['Miniexcavadora', 'Excavadora mediana', 'Excavadora de mayor capacidad', 'Tractor', 'Equipo de compactación'],
    contact: { phone: '9408-4995', email: 'gerencia@solucionesmarlons.com' },
  },
]

export const stats = [
  { value: companies.length, label: 'Empresas del grupo' },
  { value: 160, suffix: '+', label: 'Colaboradores' },
  { value: 6, label: 'Áreas centralizadas' },
  { value: 8, label: 'Años consolidando' },
]

export const pillars = [
  ['Sostenibilidad financiera', 'Crecimiento rentable y una gestión estratégica de recursos que fortalece cada decisión.'],
  ['Expansión comercial', 'Más presencia, mejores alianzas y un portafolio que llega donde el mercado lo necesita.'],
  ['Excelencia operativa', 'Procesos precisos para lograr la calidad y los tiempos de respuesta que nos diferencian.'],
  ['Experiencia del cliente', 'Cada contacto cuenta: escuchamos, resolvemos y construimos relaciones duraderas.'],
  ['Transformación digital', 'Tecnología e innovación para modernizar operaciones y liderar el sector.'],
]

export const processes = [
  { title: 'Venta B2B', phone: '9210-9620', channel: 'Talleres, distribuidores y flotillas', image: B + 'images/procesos/venta-b2b.jpg', steps: ['Visita del asesor', 'Levantamiento de pedido', 'Confirmación', 'Entrega', 'Facturación'] },
  { title: 'Compra en mostrador', phone: '9250-7107', channel: 'Cliente final · B2C', image: B + 'images/procesos/mostrador.jpg', steps: ['Atención personalizada', 'Pago en caja', 'Soporte postventa'] },
  { title: 'Entrega a domicilio', phone: '9250-7107', channel: 'Pedidos hasta tu puerta', image: B + 'images/procesos/entrega.jpg', steps: ['Confirmación de pedido', 'Elección del método de pago', 'Entrega', 'Factura'] },
  { title: 'Devoluciones', channel: 'Según la política vigente', image: B + 'images/procesos/devoluciones.jpg', reasons: ['Producto defectuoso', 'Error de pedido', 'Incompatibilidad'] },
]

export const milestones = [
  ['2018', 'Fundación', 'Nace Grupo Empresarial CAP con la visión de consolidar el sector automotriz hondureño.', [['Grupo CAP', B + 'logos/cap.png']]],
  ['2021', 'Expansión B2B', 'Inversiones S&M y Distribuidora Mansiago inician operaciones a nivel nacional.', [['Inversiones S&M', B + 'logos/sym.jpg'], ['Distribuidora Mansiago', B + 'logos/mansiago.jpg']]],
  ['2022', 'Canal B2C', 'Auto Repuestos Blessing abre sus puertas al público con tiendas de venta al detalle.', [['Auto Repuestos Blessing', B + 'logos/blessing.png']]],
  ['2025', 'Servicios', 'Tecnicentro DIDASA se incorpora al grupo con talleres de instalación y mantenimiento.', [['Tecnicentro DIDASA', B + 'logos/didasa.jpg']]],
  ['2026', 'Consolidación', 'Más empresas, más talento y cobertura nacional completa.', [['Grupo CAP', B + 'logos/cap.png']]],
]

export const gallery = [
  { src: B + 'images/equipo-almacen-2.jpg', alt: 'Colaboradores de Grupo CAP reunidos en el almacén', caption: 'Un mismo equipo', layout: 'feature', position: '50% 55%' },
  { src: B + 'images/sala-juntas.jpg', alt: 'Equipo administrativo de Grupo CAP en la sala de juntas', caption: 'Sala de juntas', layout: 'wide', position: '50% 60%' },
  { src: B + 'images/colaborador.jpg', alt: 'Colaborador de Grupo CAP en su estación de trabajo', caption: 'Compromiso diario', layout: 'wide', position: '60% 40%' },
]

export const zones = [
  { city: 'Tegucigalpa', text: 'Sede corporativa, bodegas, tiendas y talleres', x: 43.8, y: 64.2, hub: true },
  { city: 'San Pedro Sula', text: 'Cobertura comercial y distribución', x: 12, y: 20 },
  { city: 'La Ceiba', text: 'Atención a la costa norte', x: 59.6, y: 12 },
  { city: 'Comayagua', text: 'Distribución en la zona central', x: 27.6, y: 52.4, side: 'left' },
  { city: 'Choluteca', text: 'Cobertura en la zona sur', x: 44.6, y: 88 },
  { city: 'Olancho', text: 'Atención al oriente del país', x: 82, y: 45.9, side: 'left' },
]
