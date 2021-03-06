import React, { useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { area, curveBasis, curveLinear } from 'd3-shape'
import { select } from 'd3-selection'

function generateData(props) {
  const { x, y, depth } = props
  const subhills = 10
  const step = window.innerWidth / subhills
  const seed = [...Array(subhills + 4).keys()].map((i) => i - 1)
  const data = seed.map((sx) => ({
    x: x(sx * step),
    y: y(Math.random() * 300 - depth * 20)
  }))
  return data
}

export function Hill(props) {
  const { y, scrollY, mouseX } = props
  const [data] = useState(generateData(props))
  const l = area()
    .x(mapX)
    .y0((d) => d.y - scrollOverLast(d))
    .y1((d) => y(0))
    .curve(curveLinear)

  function mapX(d) {
    // map to [-1, 1]
    const normalize = (mouseX / window.innerWidth - 0.5) * 2
    return d.x + normalize * props.order * 20
  }

  function scrollOverLast() {
    const current = Math.max(0, scrollY + window.innerHeight - document.body.scrollHeight + 500)
    return ((current * 0.15 * (props.total - props.order)) / props.total) * 2
  }

  return <animated.path depth={props.depth} d={l(data)} fill={props.fill} />
}
