'use strict';
var d3 = d3 || {};

var svg = d3.select('body').append('svg')
  .attr('id', 'd3-logo')
  .attr('class', 'd3-logo')
  .attr('width', 500).attr('height', 500);

var g = svg.append('g')
  .attr('width', 500).attr('height', 500);

g.append('rect')
  .attr('style', 'fill: none')
  .attr('x', -250).attr('y', -250)
  .attr('width', 500).attr('height', 500);

g.attr('transform', 'translate(251.5, 252)rotate(26.4)');

var blueLines = g.append('g')
  .attr('id', 'blue-lines')
  .attr('class', 'blue-lines');

// center ciricle
blueLines.append('circle')
  .attr('class', 'blue-fill')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 25.2);

// bar
blueLines.append('rect')
  .attr('class', 'blue-fill')
  .attr('x', -8)
  .attr('y', -237)
  .attr('height', 237)
  .attr('width', 16);

var arcSteps = 100.0,
  arcStart = 2*Math.PI,
  arcEnd = 0.8;

var arcs = [[56, 78], [108, 128], [159, 179], [210, 237]];
arcs.forEach(function(r) {
  var innerRadius = r[0],
    outerRadius = r[1],
    data = [];

  for (var i = 0; i < arcSteps; i++) {
    data.push(arcStart + (arcEnd-arcStart)/arcSteps*i);
  }

  var arc = d3.svg.area.radial()
    .innerRadius(function(d, i) {
      return (innerRadius + i/arcSteps * (outerRadius - innerRadius) / 2);
    })
    .outerRadius(function(d, i) {
      return (outerRadius - i/arcSteps * (outerRadius - innerRadius) / 2);
    })
    .angle(function(d) { return d; });

  blueLines.append('path')
    .attr('class', 'blue-fill')
    .attr('d', arc(data));
});

var dotsG = g.append('g')
   .attr('class', 'dots');

var dotCount = 0;
var angleDots = [118, 169, 224];

addDot();
function addDot() {
  if (dotCount >= angleDots.length) {
    // return;
  }

  var dot = angleDots[Math.floor(Math.random()*angleDots.length)];
  var angle = currentAngle('blue-lines');

  var c = dotsG.append('circle')
    .attr('cx', 0)
    .attr('cy', dot)
    .attr('transform', 'rotate(' + (180+angle) + ')')
    .attr('r', 0)
    .style('stroke-width', 0)

  c.transition()
    .duration(100)
    .ease('linear')
    .attr('r', 25)
    .style('stroke-width', 9)

  c.transition().delay(200)
    .duration(3100)
    .ease('linear')
    .attr('r', 0)
    .style('stroke-width', 0)
    .remove();

  var delay = 200 + 700*Math.random();
  setTimeout(addDot, delay);
  dotCount++;
}


// var dots = [[-118, 22], [-118, -70], [-169, 56], [-169, -28], [-169, -124]];

//  dots.forEach(function(d) {
//   dotsG.append('circle')
//     .attr('cx', d[0])
//     .attr('cy', 0)
//     .attr('transform', 'rotate(' + d[1] + ')')
//     .attr('r', 25);
// });
var angle = 26.4;
// move();
function move() {
  // g.attr('transform', 'translate(251.5, 252)rotate(' + angle + ')');

  angle += 0.2;
  console.log(currentAngle());
  setTimeout(move, 1000);
}

function currentAngle(id) {
  var el = document.getElementById(id);
  var st = window.getComputedStyle(el, null);
  var tr = st.getPropertyValue('-webkit-transform') ||
           st.getPropertyValue('-moz-transform') ||
           st.getPropertyValue('-ms-transform') ||
           st.getPropertyValue('-o-transform') ||
           st.getPropertyValue('transform') ||
           'fail...';

  var values = tr.split('(')[1];
      values = values.split(')')[0];
      values = values.split(',');
  return Math.round(Math.atan2(values[1], values[0]) * (180/Math.PI));
}

