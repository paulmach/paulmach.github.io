'use strict';
var d3 = d3 || {};

buildLogo(d3.select('body').append('svg'), 1.0);
buildLogo(d3.select('body').append('svg'), 0.5);
buildLogo(d3.select('body').append('svg'), 0.25);
buildLogo(d3.select('body').append('svg'), 0.15);
buildLogo(d3.select('body').append('svg'), 0.1);

function buildLogo(svg, scale) {
  svg.attr('class', 'd3-logo')
    .attr('width', 500*scale).attr('height', 500*scale);

  var g = svg.append('g')
    .attr('width', 500).attr('height', 500);

  g.append('rect')
    .attr('style', 'fill: none')
    .attr('x', -250).attr('y', -250)
    .attr('width', 500).attr('height', 500);

  g.attr('transform', 'scale(' + scale + ')translate(251.5, 252)rotate(26.4)');

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

  var arcSteps = 80.0,
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

  // dots
  var dotsG = g.append('g')
     .attr('class', 'dots');

  // initial dots, hope my math is right to create initial state.
  var dots = [[169, -304], [118, -250], [118, -158], [169, -208],[169, -124]];
  dots.forEach(function(d) {
    var arcLength = (2*Math.PI - 0.8)/Math.PI*180;
    var p = 3400*(-d[1])/360;

    var r = (-25/3100)*p + (25 + 300*25/3100);
    addSmallerDot(d[1], d[0], r);
  });

  function addSmallerDot(angle, locy, r) {
    var c = dotsG.append('circle')
      .attr('cx', 0)
      .attr('cy', locy)
      .attr('transform', 'rotate(' + (270 + angle) + ')')
      .attr('r', r)
      .style('stroke-width', 9*r/25);

    var p = r/25;
    c.transition()
      .duration(p*3100)
      .ease('linear')
      .attr('r', 0)
      .style('stroke-width', 0)
      .remove();
  }

  // the dots that come up
  addDots();
  setInterval(addDots, 4000);

  function addDots() {
    dots.forEach(function(d) {
      var a = d[1];
      setTimeout(function() {
        addDot(a, d[0]);
      }, (450+a)/360*4000 - 50);
    });
  }

  function addDot(angle, locy) {
    var c = dotsG.append('circle')
      .attr('cx', 0)
      .attr('cy', locy)
      .attr('transform', 'rotate(' + (270 + angle) + ')')
      .attr('r', 0)
      .style('stroke-width', 0);

    c.transition()
      .duration(100)
      .ease('linear')
      .attr('r', 25)
      .style('stroke-width', 9);

    c.transition().delay(200)
      .duration(3100)
      .ease('linear')
      .attr('r', 0)
      .style('stroke-width', 0)
      .remove();
  }
}
