
var Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

// Adds a vector to another. Optional clone param last
Vector.prototype.add = function() {
  var args = arguments;
  if (typeof args[0] == 'number' && typeof args[1] == 'number') {
    var v = args[2] ? this.clone() : this;
    v.x += args[0];
    v.y += args[1];
    return v;
  }
  else if (args[0] instanceof Vector) {
    var v = args[1] ? this.clone() : this;
    v.x += args[0].x;
    v.y += args[0].y;
    return v;
  }
  else {
    throw new Error('Fecal matter');
  }
};

// Subtracts a vector from another. Optional clone param last
Vector.prototype.subtract = function() {
  var args = arguments;
  if (typeof args[0] == 'number' && typeof args[1] == 'number') {
    return this.add(-x, -y, args[2]);
  }
  else if (args[0] instanceof Vector) {
    return this.add(-args[0].x, -args[0].y, args[1]);
  }
  else {
    throw new Error('Fecal splatter');
  }
};

// Rescale a vector
Vector.prototype.scale = function(factor, clone) {
  var v = clone ? this.clone() : this;
  v.x *= factor;
  v.y *= factor;
  return v;
};
// Returns a normalizaded vector
Vector.prototype.norm = function(clone) {
  var v = clone ? this.clone() : this;
  var normLen = this.length()
  v.x = v.x/normLen;
  v.y = v.y/normLen;
  return v;
};

Vector.prototype.length = function() {
  return Math.sqrt(Math.pow(this.x, 2)+Math.pow(this.y, 2));
}

Vector.prototype.rotate = function(angle, clone) {
  var v = clone ? this.clone() : this
    , x = v.x, y = v.y;
  v.x = x * Math.cos(angle) - Math.sin(angle) * y;
  v.y = x * Math.sin(angle) + Math.cos(angle) * y;
  return v;
};

Vector.prototype.angle = function() {
  return Math.atan(this.y/this.x);
};

Vector.prototype.clone = function() {
  return new Vector(this.x, this.y);
};

Vector.prototype.distanceSq = function(v2) {
  return Math.pow(v2.x - this.x, 2) + Math.pow(v2.y - this.y, 2);
};

Vector.prototype.distance = function(v2) {
  return Math.sqrt(this.distanceSq(v2));
};

var Line = function(v1, v2, clone) {
  this.v1 = clone ? v1.clone() : v1;
  this.v2 = clone ? v2.clone() : v2;
};

Line.prototype.clone = function() {
  return new Line(this.v1.clone(), this.v2.clone());
};

// Find intersection point between two lines
// Returns a vector, the elements of it will be NaN if parallel lines
// http://en.wikipedia.org/wiki/Line-line_intersection
Line.prototype.intersection = function(line2, extendLines) {
  var x1 = this.v1.x
    , x2 = this.v2.x
    , y1 = this.v1.y
    , y2 = this.v2.y
    , x3 = line2.v1.x
    , x4 = line2.v2.x
    , y3 = line2.v1.y
    , y4 = line2.v2.y;
  
  // Intersection x
  var ix = ((x1*y2 - y1*x2) * (x3 - x4) - (x1 - x2) * (x3*y4 - y3*x4)) / ((x1-x2)*(y3-y4) - (y1-y2) * (x3-x4));
  var iy = ((x1*y2 - y1*x2) * (y3 - y4) - (y1 - y2) * (x3*y4 - y3*x4)) / ((x1-x2)*(y3-y4) - (y1-y2) * (x3-x4));
  var is = new Vector(ix, iy); // Intersection point
  if (isNaN(is.x) || isNaN(is.y))
    return false;
  if (!extendLines) {
    // Now create two Rectangles from the lines and check that the intersection point
    // is inside BOTH Rectangles (draw it down if you don't believe me).
    var rect1 = new Rectangle(this.v1, this.v2)
      , rect2 = new Rectangle(line2.v1, line2.v2);
    if (!rect1.contains(is) || !rect2.contains(is))
      return false;
  }
  return is;
};

// Returns a boolean if intersection is made or not
Line.prototype.intersects = function(line2) {
  var is = this.intersection(line2);
  if (isNaN(is.x) || isNaN(is.y))
    return false;
  
};

// A Rectangle
// v1 should be one corner, v2 the other (vectors)
var Rectangle = function(v1, v2) {
  this.v1 = v1;
  this.v2 = v2;
};

// For easier usage, return an object with compass directions {n: 10, e: 150, s: -5, w: 130}
Rectangle.prototype.compass = function() {
  return {
    n: Math.min(this.v1.y, this.v2.y),
    e: Math.max(this.v1.x, this.v2.x),
    s: Math.max(this.v1.y, this.v2.y),
    w: Math.min(this.v1.x, this.v2.x)
  };
};

// Width and height of a rect
Rectangle.prototype.dimensions = function() {
  return {
    width: Math.abs(this.v1.x - this.v2.x),
    height: Math.abs(this.v1.y - this.v2.y)
  };
};

// Is a point inside this Rectangle?
// Strict means the point is only counted as inside if it's NOT on the edge, but really INSIDE
Rectangle.prototype.contains = function(v, allowEdges) {
  var compass = this.compass()
    , inside;
  if (allowEdges)
    inside = (v.y >= compass.n && v.y <= compass.s && v.x >= compass.w && v.x <= compass.e);
  else
    inside = (v.y > compass.n && v.y < compass.s && v.x > compass.w && v.x < compass.e);
  return inside;
};

// Create a closed polygon
// Polys must have at least 3 points
var Polygon = function(points) {
  this.points = points;
};

// Returns the intersection point closest to src or false if no intersection
Polygon.prototype.intersection = function(src, dst) {
  var c = poly.points.length
  , line = new Line(src, dst)
  , intersections = []; // All found intersections
  // Loop the points, create lines and see if each line intersects, then push
  _.each(poly.points, function(p, i) {
    var j = (i+1) % c
      , is
      , tmpLine = new Line(p, poly.points[j]);
    if (is = line.intersection(tmpLine))
      intersections.push(is);
  });
  if (!intersections.length)
    return false;
  // Return the intersection which is closest to src
  return _.min(intersections, function(point) {
    return point.distance(src); // Minimize
  });
};


