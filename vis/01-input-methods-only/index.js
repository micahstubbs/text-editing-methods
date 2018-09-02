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
  .then(data => data.filter(d => d['Input Category'] !== 'reading'))
  .then(data =>
    data.sort(
      (a, b) =>
        a['Average Speed for adult [wpm]'] - b['Average Speed for adult [wpm]']
    )
  )
  .then(data => draw({ data }))

function draw({ data }) {
  console.log('data', data)

  const outerWidth = 960
  const outerHeight = 500
  const margin = { left: 100, top: 10, right: 50, bottom: 75 }

  // colors
  const themeDarkGray = '#444444'
  const themeBookEmojiGray = '#dfdfe8'
  const blogBlue = '#367da2'
  const blogGray = '#eaeaea'
  const blogDarkGray = '#333333'

  const selector = 'body'
  d3.select(selector)
    .append('div')
    .attr('id', 'vis')
    .append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
    .style('border', '1px solid #c3c3c3')

  const parent = document.getElementById('vis')
  const svg = d3.select(parent).select('svg')

  // background
  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', outerWidth)
    .attr('height', outerHeight)
    .style('fill', blogGray)

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const innerWidth = outerWidth - margin.left - margin.right
  const innerHeight = outerHeight - margin.top - margin.bottom

  const meanVariable = 'Average Speed for adult [wpm]'
  const minVariable = 'Lower bound [wpm]'
  const maxVariable = 'Upper bound [wpm]'
  const yVariable = 'emoji'

  const xAxisLabelText = 'input speed, words per minute'
  const xAxisLabelOffset = 50

  console.log('width', outerWidth)
  console.log('height', outerHeight)

  const xAxisG = g
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${innerHeight})`)

  const xAxisLabel = xAxisG
    .append('text')
    .style('text-anchor', 'middle')
    .style('fill', themeDarkGray)
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
    .style('stroke', blogBlue)
    .style('stroke-width', '2px')

  lines.exit().remove()
}
