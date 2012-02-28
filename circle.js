var Circle = function(radius, position, color) {
  this.setRadius(radius);
  this.position = position;
  this.color = color;
};
Circle.prototype.setRadius = function(radius) {
  this.radius=radius;
  this.radiusSq = radius*radius;
};
Circle.prototype.collide = function(circle) { 
  return this.position.distanceSq(circle.position) < this.radiusSq + circle.radiusSq;
};

Circle.prototype.render = function() {
  ctx.fillStyle = this.color;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
