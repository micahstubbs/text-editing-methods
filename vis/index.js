d3.csv('text-editing-methods-speed.csv').then(data => draw({ data }))

function draw({ data }) {
  console.log('data', data)

  const selector = 'body'
  d3.select(selector)
    .append('div')
    .attr('id', 'vis')
    .append('svg')

  const parent = document.getElementById('vis')
  const svg = d3.select(parent).select('svg')

  // draw the first time
  redraw({ data, parent, svg })

  // redraw based on the new size whenever
  // the browser window is resized
  window.addEventListener('resize', redraw.bind(null, { data, parent, svg }))
}

function redraw({ data, parent, svg }) {
  // extract the width and the height that was computed by CSS
  const outerWidth = parent.clientWidth
  const outerHeight = parent.clientHeight
  const margin = { left: 165, top: 0, right: 20, bottom: 90 }
  const innerWidth = outerWidth - margin.left - margin.right
  const innerHeight = outerHeight - margin.top - margin.bottom

  const xAxisLabelText = 'input speed, words per minute'
  const xAxisLabelOffset = 75

  console.log('width', outerWidth)
  console.log('height', outerHeight)

  // use the the extracted size to set the size of an SVG element
  svg.attr('width', outerWidth).attr('height', outerHeight)

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const xAxisG = g
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${innerHeight})`)

  const xAxisLabel = xAxisG
    .append('text')
    .style('text-anchor', 'middle')
    .style('fill', 'black')
    .style('font-size', 16)
    .attr('x', innerWidth / 2)
    .attr('y', xAxisLabelOffset)
    .attr('class', 'label')
    .text(xAxisLabelText)

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d['Upper bound [wpm]'])])
    .range([0, innerWidth])

  const yScale = d3
    .scaleBand()
    .domain(data.map(d => d.emoji))
    .range([innerHeight, 0])

  const xAxis = d3.axisBottom(xScale).ticks(5)
  // .tickFormat()
  // .outerTickSize(0)

  xAxisG.call(xAxis)
}
