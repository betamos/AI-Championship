var canvas, ctx;
var conf = {
  width: 500,
  height: 400,
  earthRadius: 100,
  moonRadius: 30,
  moonReduceRadius: 5, // How much the radius should be reduced on full speed
  moonDistance: 200,
  moonSpeed: 0.0005,
  moonMaxSpeed: 0.006,
  moonMinSpeed: 0.0005,
  moonAcceleration: 0.0006,
  moonRetardation: 0.00045,
  podSize: 10,
  podMaxSpeed: 0.1,
  pieCount: 10,
  podColor: '#00FFFF',
  asteroidRadius: 10,
  asteroidSpeed: 0.00005,
  asteroidGenerationInterval: 2000,
  incrementLevelInterval: 30000, // 30 sec
  moonMaxContraction: 0 // How much the moon closes in on the earth at max speed
};
var pushed = false;
var score = 0;

window.addEventListener('DOMContentLoaded', function(e) {

  console.log('running game…');

  conf.width = window.innerWidth;
  conf.height = window.innerHeight;

  canvas = document.getElementById('game');
  canvas.width = conf.width;
  canvas.height = conf.height;
  
  canvas.contains = function (circle) {
    if (circle.position.x < -100)
    {
      return false;
    }
    if (circle.position.y < -100)
    {
      return false;
    }
    if (circle.position.x > canvas.width+100)
    {
      return false;
    }
    if (circle.position.y > canvas.height+100)
    {
      return false;
    }
    return true;
  };
  
  ctx = canvas.getContext('2d');
  init();

  window.addEventListener('keydown', function(e) {
    if (e.keyCode == 32) {
      pushed = true;
      window.addEventListener('keyup', keyupHandler);
    }
  });
  // usage: 
// instead of setInterval(render, 16) ....

  var prevTime;
  (function animloop(newTime){
    requestAnimFrame(animloop);
    render();
    update((newTime - prevTime) || 0);
    prevTime = newTime;
  })();
  // place the rAF *before* the render() to assure as close to 
  // 60fps with the setTimeout fallback.
});

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var keyupHandler = function(e) {
  if (e.keyCode == 32) {
    pushed = false;
    window.removeEventListener('keyup', keyupHandler);
  }
};
