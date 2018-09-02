d3.csv('text-editing-methods-speed.csv')
  .then(data =>
    data.map(d => {
      d['Average Speed for adult [wpm]'] = Number(
        d['Average Speed for adult [wpm]']
      )
      d['Lower bound [wpm]'] = Number(d['Lower bound [wpm]'])
      d['Upper bound [wpm]'] = Number(d['Upper bound [wpm]'])
      return d
    })
  )
  .then(data => draw({ data }))

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
  const margin = { left: 165, top: 10, right: 50, bottom: 90 }
  const innerWidth = outerWidth - margin.left - margin.right
  const innerHeight = outerHeight - margin.top - margin.bottom

  const meanVariable = 'Average Speed for adult [wpm]'
  const minVariable = 'Lower bound [wpm]'
  const maxVariable = 'Upper bound [wpm]'
  const yVariable = 'emoji'

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

  const yAxisG = g.append('g').attr('class', 'y axis')

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d[maxVariable])])
    .range([0, innerWidth])

  const yScale = d3
    .scaleBand()
    .domain(data.map(d => d[yVariable]).reverse())
    .range([innerHeight, 0])

  const xAxis = d3.axisBottom(xScale).ticks(5)
  const yAxis = d3.axisLeft(yScale)

  xAxisG.call(xAxis)
  yAxisG.call(yAxis)

  const lines = g.selectAll('.line').data(data)
  const yOffset = yScale.bandwidth() / 2

  lines
    .enter()
    .append('line')
    .attr('class', '.line')
    .attr('x1', d => xScale(d[minVariable]))
    .attr('x2', d => xScale(d[maxVariable]))
    .attr('y1', d => yScale(d[yVariable]) + yOffset)
    .attr('y2', d => yScale(d[yVariable]) + yOffset)
    // .attr('y2', yScale.bandwidth() / 4)
    .style('stroke', 'steelblue')
    .style('stroke-width', '2px')

  lines.exit().remove()
}
