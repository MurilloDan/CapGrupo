import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

const cfg = {
  header: 'HN // 14.07°N 87.21°O',
  colors: {
    background: '#c1161d',
    panel: '#d71920',
    outline: '#f6c9cc',
    fill: 'rgba(255,255,255,0.15)',
    label: '#5a0a10',
    labelText: '#ffffff',
    point: '#d8232f',
    lines: 'rgba(255,255,255,0.65)',
  },
  hub: 'Tegucigalpa',
  cities: [
    { name: 'Tegucigalpa', lon: -87.1921, lat: 14.0723, capital: true, side: 'right' },
    { name: 'San Pedro Sula', lon: -88.025, lat: 15.5042, side: 'right' },
    { name: 'La Ceiba', lon: -86.7822, lat: 15.7597, side: 'right' },
    { name: 'Comayagua', lon: -87.6376, lat: 14.4515, side: 'left' },
    { name: 'Olancho', lon: -86.2194, lat: 14.6667, side: 'left' },
    { name: 'Choluteca', lon: -87.1908, lat: 13.3007, side: 'right' },
  ],
}

export default function MapaHonduras() {
  const mapRef = useRef(null)
  const svgRef = useRef(null)

  useEffect(() => {
    const renderMap = async () => {
      if (!mapRef.current) return

      d3.select(mapRef.current).selectAll('svg').remove()

      const topo = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then((r) =>
        r.json(),
      )
      const hn = topojson.feature(topo, topo.objects.countries).features.find((f) => f.id === '340')
      const C = cfg.colors
      const W = mapRef.current.clientWidth
      const H = (W * 9) / 16
      const pad = 40

      const svg = d3
        .select(mapRef.current)
        .append('svg')
        .attr('viewBox', `0 0 ${W} ${H}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style('width', '100%')
        .style('height', '100%')

      const defs = svg.append('defs')
      defs
        .append('pattern')
        .attr('id', 'dots')
        .attr('width', 24)
        .attr('height', 24)
        .attr('patternUnits', 'userSpaceOnUse')
        .append('circle')
        .attr('cx', 12)
        .attr('cy', 12)
        .attr('r', 1.4)
        .attr('fill', 'rgba(255,255,255,0.18)')

      const glow = defs.append('filter').attr('id', 'glow').attr('x', '-10%').attr('y', '-10%').attr('width', '120%').attr('height', '120%')
      glow.append('feGaussianBlur').attr('stdDeviation', 6).attr('result', 'b')
      const m = glow.append('feMerge')
      m.append('feMergeNode').attr('in', 'b')
      m.append('feMergeNode').attr('in', 'SourceGraphic')

      svg
        .append('rect')
        .attr('x', pad)
        .attr('y', pad)
        .attr('width', W - pad * 2)
        .attr('height', H - pad * 2)
        .attr('fill', C.panel)
        .attr('stroke', 'rgba(255,255,255,0.35)')
        .attr('stroke-width', 2)

      svg
        .append('rect')
        .attr('x', pad)
        .attr('y', pad)
        .attr('width', W - pad * 2)
        .attr('height', H - pad * 2)
        .attr('fill', 'url(#dots)')

      svg
        .append('text')
        .attr('x', pad + 32)
        .attr('y', pad + 50)
        .text(cfg.header)
        .attr('fill', 'rgba(255,255,255,0.75)')
        .attr('font-family', '"JetBrains Mono", monospace')
        .attr('font-size', 22)
        .attr('letter-spacing', 1.5)

      const proj = d3.geoMercator().fitExtent(
        [
          [pad + 160, pad + 110],
          [W - pad - 160, H - pad - 90],
        ],
        hn,
      )
      const path = d3.geoPath(proj)

      svg
        .append('path')
        .attr('d', path(hn))
        .attr('fill', C.fill)
        .attr('stroke', C.outline)
        .attr('stroke-width', 7)
        .attr('stroke-linejoin', 'round')
        .attr('filter', 'url(#glow)')

      const pts = cfg.cities.map((c) => ({ ...c, xy: proj([c.lon, c.lat]) }))
      const hub = pts.find((p) => p.name === cfg.hub) || pts[0]
      const g = svg.append('g')

      pts.filter((p) => p !== hub).forEach((p) =>
        g
          .append('line')
          .attr('x1', hub.xy[0])
          .attr('y1', hub.xy[1])
          .attr('x2', p.xy[0])
          .attr('y2', p.xy[1])
          .attr('stroke', C.lines)
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '8 8'),
      )

      pts.forEach((p) => {
        const [x, y] = p.xy
        const r = p.capital ? 17 : 11

        g.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', r)
          .attr('fill', p.capital ? '#fff' : C.point)
          .attr('stroke', '#fff')
          .attr('stroke-width', p.capital ? 0 : 3.5)

        const lab = g.append('g')
        const t = lab
          .append('text')
          .text(p.name.toUpperCase())
          .attr('fill', C.labelText)
          .attr('font-family', '"Montserrat", sans-serif')
          .attr('font-weight', 800)
          .attr('font-size', 16)
          .attr('letter-spacing', 0.8)
          .attr('dominant-baseline', 'central')

        const w = t.node().getComputedTextLength()
        const bx = 14
        const gap = r + 16
        const tx = p.side === 'left' ? x - gap - w - bx : x + gap + bx

        t.attr('x', tx).attr('y', y)

        lab
          .insert('rect', 'text')
          .attr('x', tx - bx)
          .attr('y', y - 22)
          .attr('width', w + bx * 2)
          .attr('height', 44)
          .attr('rx', 4)
          .attr('fill', C.label)
          .attr('opacity', 0.92)
      })

      svgRef.current = svg
    }

    renderMap()

    return () => {
      if (mapRef.current && svgRef.current) {
        d3.select(mapRef.current).selectAll('svg').remove()
      }
    }
  }, [])

  return <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
}
