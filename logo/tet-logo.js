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

  g.attr('transform', 'scale(' + scale + ')translate(252, 252)rotate(26)');

  // blueLines is what is rotated by the css animation.
  var blueLines = g.append('g')
    .attr('id', 'blue-lines')
    .attr('class', 'blue-lines');

  // center ciricle
  blueLines.append('circle')
    .attr('class', 'blue-fill')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 25);

  // bar
  blueLines.append('rect')
    .attr('class', 'blue-fill')
    .attr('x', -8)
    .attr('y', -237)
    .attr('height', 237)
    .attr('width', 16);

  // draw the arcs
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
  // [vertical y from center, angle (backwards from the blue bar]
  var dots = [[169, -214], [118, -160], [169, -118], [118, -68], [169, -34]];
  var angleTotal = (2*Math.PI - 0.8)*(180/Math.PI); // total angle involved in animations.
  dots.forEach(function(d) {
    var a = d[1] - 200/4000; // 200ms delay, before 3100ms fade out starts
    var p = (angleTotal+a)/angleTotal;
    addSmallerDot(d[1], d[0], p);
  });

  function addSmallerDot(angle, locy, p) {
    var c = dotsG.append('circle')
      .attr('cx', 0)
      .attr('cy', -locy) // negative y is up in graphics
      .attr('transform', 'rotate(' + angle + ')')
      .attr('r', 25*p)
      .style('stroke-width', 9*p);

    c.transition()
      .duration(p*3100) // 3100ms standard fade out
      .ease('linear')
      .attr('r', 0)
      .style('stroke-width', 0)
      .remove();
  }

  // the dots that come up
  addDots();
  setInterval(addDots, 4000);

  function addDots() {
    // get the current rotation angle so if there is
    // some sort of animation delay we can account for it.
    var angle = currentAngle() + 360;
    dots.forEach(function(d) {
      var a = d[1];
      setTimeout(function() {
        addDot(a, d[0]);
      }, (360+a)/360*4000 - 50 + (360-angle)/360*4000);
    });
  }

  function addDot(angle, locy) {
    var c = dotsG.append('circle')
      .attr('cx', 0)
      .attr('cy', -locy) // negative y is up in graphics
      .attr('transform', 'rotate(' + angle + ')')
      .attr('r', 0)
      .style('stroke-width', 0);

    c.transition()
      .duration(100)
      .ease('linear')
      .attr('r', 25)
      .style('stroke-width', 9);

    c.transition().delay(200) // 200ms delay before 3100ms fade out starts.
      .duration(3100)
      .ease('linear')
      .attr('r', 0)
      .style('stroke-width', 0)
      .remove();
  }

  function currentAngle() {
    try {
      // source: https://css-tricks.com/get-value-of-css-rotation-through-javascript/
      var el = document.getElementById('blue-lines');
      var st = window.getComputedStyle(el, null);
      var tr = st.getPropertyValue('-webkit-transform') ||
               st.getPropertyValue('-moz-transform') ||
               st.getPropertyValue('-ms-transform') ||
               st.getPropertyValue('-o-transform') ||
               st.getPropertyValue('transform') ||
               'fail...';

      // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix
      var values = tr.split('(')[1];
          values = values.split(')')[0];
          values = values.split(',');
      var a = values[0];
      var b = values[1];
      var c = values[2];
      var d = values[3];

      var scale = Math.sqrt(a*a + b*b);

      // arc sin, convert from radians to degrees, round
      // DO NOT USE: see update below
      var sin = b/scale;
      var angle = Math.round(Math.asin(sin) * (180/Math.PI));

      return angle;
    }
    catch(err) {
      return 0;
    }
  }
}
