var canvas, ctx;
var conf = {
  width: 500,
  height: 400,
  ball: {
    radius: 5,
    color: 'grey',
    speed: 0.2,
    friction: 0.02
  },
  player: {
    radius: 10,
    color: 'red',
    speed: 2
  }
};

window.addEventListener('DOMContentLoaded', function(e) {

  console.log('running game…');

  canvas = document.getElementById('game');
  canvas.width = conf.width;
  canvas.height = conf.height;
  
  
  ctx = canvas.getContext('2d');
  init();

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
