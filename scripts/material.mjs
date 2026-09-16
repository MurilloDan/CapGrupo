// Genera el material corporativo descargable (PDF y PNG) a partir de src/data.js.
// Uso: npm run material   (requiere Google Chrome o Chromium; CHROME=/ruta/al/binario para cambiarlo)
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { companies, contact, group, milestones, pillars, stats, zones } from '../src/data.js'

const root = resolve(import.meta.dirname, '..')
const out = join(root, 'public/material')
const chrome = process.env.CHROME ?? ['google-chrome', 'chromium', 'chromium-browser'].find((bin) => {
  try { execFileSync('which', [bin], { stdio: 'ignore' }); return true } catch { return false }
})
if (!chrome) throw new Error('No se encontró Chrome/Chromium. Define CHROME=/ruta/al/binario.')

const asset = (path) => pathToFileURL(join(root, 'public', path.replace(/^\//, ''))).href
const esc = (text = '') => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const pad = (value) => String(value).padStart(2, '0')

const base = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body { font-family: 'Manrope', system-ui, sans-serif; color: #1a1a1a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  h1, h2, h3, p { margin: 0; }
  .label { color: #d71920; font-size: 10px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; }
  .muted { color: #5e5a5a; }
`

const profile = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${base}
  @page { size: A4; margin: 0; }
  .page { position: relative; width: 210mm; height: 297mm; padding: 20mm 18mm 18mm; overflow: hidden; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  .cover { display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(160deg, #d71920, #8f0f15); color: #fff; }
  .cover:after { content: ''; position: absolute; right: -40mm; bottom: -30mm; width: 150mm; aspect-ratio: .866; clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); background: rgba(255,255,255,.08); }
  .cover img { width: 48mm; }
  .cover h1 { font-size: 46px; line-height: 1.02; letter-spacing: -1.5px; font-weight: 800; }
  .cover p { max-width: 130mm; margin-top: 8mm; font-size: 14px; line-height: 1.6; opacity: .9; }
  .cover .label { color: rgba(255,255,255,.8); margin-bottom: 6mm; }
  .cover footer { display: flex; justify-content: space-between; font-size: 11px; opacity: .85; }
  .head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 5mm; margin-bottom: 9mm; border-bottom: 1px solid #ebe4e4; }
  .head img { height: 9mm; }
  h2 { font-size: 26px; letter-spacing: -.6px; font-weight: 800; margin: 2mm 0 5mm; }
  .lead { font-size: 13px; line-height: 1.65; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; margin: 8mm 0 10mm; }
  .stats div { padding: 4mm 5mm; border-left: 2px solid #d71920; background: #f8f6f6; }
  .stats b { display: block; color: #d71920; font-size: 24px; font-weight: 800; }
  .stats span { font-size: 9.5px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #5e5a5a; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
  .box { padding: 6mm; border: 1px solid #ebe4e4; }
  .box p { font-size: 11.5px; line-height: 1.6; margin-top: 2mm; }
  .chips { display: flex; flex-wrap: wrap; gap: 2mm; margin-top: 3mm; }
  .chips span { padding: 1.5mm 3mm; background: rgba(215,25,32,.08); color: #b0141a; font-size: 10px; font-weight: 700; }
  .company { display: grid; grid-template-columns: 18mm 1fr; gap: 5mm; padding: 3.2mm 0; border-bottom: 1px solid #ebe4e4; break-inside: avoid; }
  .company img { width: 18mm; height: 18mm; object-fit: contain; border: 1.5px solid #d71920; border-radius: 50%; padding: 2.5mm; background: #fff; }
  .company h3 { font-size: 14px; font-weight: 800; }
  .company .label { font-size: 8.5px; margin: 1mm 0 1.5mm; }
  .company p { font-size: 10.5px; line-height: 1.5; }
  .company small { display: block; margin-top: 1.5mm; font-size: 9.5px; color: #5e5a5a; }
  ul.pillars, ol.time { list-style: none; margin: 0; padding: 0; }
  ul.pillars li { padding: 2.2mm 0; border-bottom: 1px solid #ebe4e4; font-size: 11px; line-height: 1.5; }
  ul.pillars b { display: block; font-size: 12px; }
  ol.time li { display: grid; grid-template-columns: 16mm 1fr; padding: 1.8mm 0; font-size: 11px; line-height: 1.5; }
  ol.time b { color: #d71920; font-size: 13px; }
  .zones { font-size: 11px; line-height: 1.55; }
  .zones b { color: #1a1a1a; }
  .contact { margin-top: 7mm; padding: 7mm; background: #d71920; color: #fff; }
  .contact .label { color: rgba(255,255,255,.8); }
  .contact p { font-size: 12px; line-height: 1.7; margin-top: 2mm; }
</style></head><body>
  <section class="page cover">
    <img src="${asset('logos/cap-blanco.png')}" alt="Grupo CAP">
    <div>
      <div class="label">Perfil corporativo · ${new Date().getFullYear()}</div>
      <h1>Grupo Empresarial CAP</h1>
      <p>${esc(group.lead)}</p>
    </div>
    <footer><span>${esc(contact.city)}</span><span>grupocap@cap.hn</span></footer>
  </section>

  <section class="page">
    <div class="head"><img src="${asset('logos/cap.png')}" alt=""><span class="label">01 · Quiénes somos</span></div>
    <span class="label">Identidad</span>
    <h2>Un grupo, un mismo estándar.</h2>
    <p class="lead muted">${esc(group.traits)}</p>
    <div class="stats">${stats.map((s) => `<div><b>${pad(s.value)}${s.suffix ?? ''}</b><span>${esc(s.label)}</span></div>`).join('')}</div>
    <div class="two">
      <div class="box"><span class="label">Misión</span><p>${esc(group.mission)}</p></div>
      <div class="box"><span class="label">Visión</span><p>${esc(group.vision)}</p></div>
    </div>
    <div class="box" style="margin-top:6mm"><span class="label">Servicios compartidos</span><div class="chips">${group.sharedServices.map((s) => `<span>${esc(s.label)}</span>`).join('')}</div></div>
  </section>

  <section class="page">
    <div class="head"><img src="${asset('logos/cap.png')}" alt=""><span class="label">02 · Nuestras empresas</span></div>
    <span class="label">Portafolio</span>
    <h2>Empresas del grupo</h2>
    ${companies.map((c) => `<div class="company"><img src="${asset(c.logo)}" alt="">
      <div><h3>${esc(c.name)}</h3><div class="label">${esc(c.type)}</div><p class="muted">${esc(c.description ?? c.text)}</p>
      <small>${[c.contact?.phone && `Tel. ${c.contact.phone}`, c.contact?.email, c.website?.replace('https://', '')].filter(Boolean).map(esc).join(' · ')}</small></div></div>`).join('')}
  </section>

  <section class="page">
    <div class="head"><img src="${asset('logos/cap.png')}" alt=""><span class="label">03 · Cobertura y trayectoria</span></div>
    <span class="label">Cobertura</span>
    <h2>Presencia nacional</h2>
    <div class="zones muted">${zones.map((z) => `<p><b>${esc(z.city)}</b> — ${esc(z.text)}</p>`).join('')}</div>
    <div style="margin-top:10mm"><span class="label">Trayectoria</span>
      <ol class="time">${milestones.map(([year, title, text]) => `<li><b>${year}</b><span><b style="color:#1a1a1a;font-size:11.5px">${esc(title)}.</b> <span class="muted">${esc(text)}</span></span></li>`).join('')}</ol>
    </div>
    <div style="margin-top:9mm"><span class="label">Pilares estratégicos</span>
      <ul class="pillars">${pillars.map(([title, text]) => `<li><b>${esc(title)}</b><span class="muted">${esc(text)}</span></li>`).join('')}</ul>
    </div>
    <div class="contact"><span class="label">Contacto corporativo</span>
      <p>${esc(contact.address)}<br>Tel. ${esc(contact.phone)} · grupocap@cap.hn<br>${esc(contact.hours)}</p>
    </div>
  </section>
</body></html>`

const summary = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${base}
  html { background: #1a1a1a; }
  body { display: flex; flex-direction: column; width: 100vw; height: 100vh; overflow: hidden; background: #fff; }
  .top { position: relative; padding: 70px 80px 76px; overflow: hidden; background: linear-gradient(160deg, #d71920, #8f0f15); color: #fff; }
  .top:after { content: ''; position: absolute; right: -120px; top: -40px; width: 560px; aspect-ratio: .866; clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); background: rgba(255,255,255,.08); }
  .top img { width: 170px; }
  .top .label { display: block; margin-top: 56px; color: rgba(255,255,255,.8); font-size: 14px; }
  .top h1 { margin-top: 14px; font-size: 76px; line-height: 1; letter-spacing: -3px; font-weight: 800; }
  .top p { max-width: 760px; margin-top: 24px; font-size: 21px; line-height: 1.55; opacity: .92; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 50px 80px 0; }
  .stats div { padding: 22px 26px; border-left: 3px solid #d71920; background: #f8f6f6; }
  .stats b { display: block; color: #d71920; font-size: 46px; font-weight: 800; letter-spacing: -1.5px; }
  .stats span { font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #5e5a5a; }
  .companies { padding: 46px 80px 0; }
  .companies .label { font-size: 13px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 18px; }
  .grid div:last-child:nth-child(3n + 1) { grid-column: 2; }
  .grid div { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid #ebe4e4; }
  .grid img { flex: none; width: 62px; height: 62px; object-fit: contain; padding: 7px; border: 2px solid #d71920; border-radius: 50%; background: #fff; }
  .grid b { display: block; font-size: 16px; }
  .grid small { color: #d71920; font-size: 10.5px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; }
  .bottom { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding: 30px 80px; background: #1a1a1a; color: #fff; font-size: 16px; }
  .bottom span:last-child { color: rgba(255,255,255,.7); }
</style></head><body>
  <div class="top">
    <img src="${asset('logos/cap-blanco.png')}" alt="Grupo CAP">
    <span class="label">Resumen corporativo</span>
    <h1>La movilidad mueve<br>el progreso.</h1>
    <p>${esc(group.lead)}</p>
  </div>
  <div class="stats">${stats.map((s) => `<div><b>${pad(s.value)}${s.suffix ?? ''}</b><span>${esc(s.label)}</span></div>`).join('')}</div>
  <div class="companies"><span class="label">Empresas del grupo</span>
    <div class="grid">${companies.map((c) => `<div><img src="${asset(c.logo)}" alt=""><span><b>${esc(c.name)}</b><small>${esc(c.type.split(' · ')[0])}</small></span></div>`).join('')}</div>
  </div>
  <div class="bottom"><span>grupocap@cap.hn · Tel. ${esc(contact.phone)}</span><span>${esc(contact.city)}</span></div>
</body></html>`

const tmp = mkdtempSync(join(tmpdir(), 'cap-material-'))
const flags = ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--virtual-time-budget=5000', `--user-data-dir=${join(tmp, 'profile')}`]
try {
  writeFileSync(join(tmp, 'perfil.html'), profile)
  writeFileSync(join(tmp, 'resumen.html'), summary)
  execFileSync(chrome, [...flags, '--no-pdf-header-footer', `--print-to-pdf=${join(out, 'perfil-corporativo-grupo-cap.pdf')}`, pathToFileURL(join(tmp, 'perfil.html')).href], { stdio: 'ignore' })
  execFileSync(chrome, [...flags, '--window-size=1200,1500', '--force-device-scale-factor=2', `--screenshot=${join(out, 'resumen-grupo-cap.png')}`, pathToFileURL(join(tmp, 'resumen.html')).href], { stdio: 'ignore' })
  console.log('Material generado en public/material/')
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
