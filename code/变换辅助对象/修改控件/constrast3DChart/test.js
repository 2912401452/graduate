// import { tween, easing } from 'popmotion';
let p = require('popmotion');
console.log('****');
turn();
function turn() {
  console.log('start');
  var mytween = p
    .tween({
      from: {
        rotateY: 0,
      },
      to: {
        rotateY: 3,
      },
      ease: p.easing.easeInOut,
      duration: 500,
    })
    .start({
      update: (o) => {
        console.log(o.rotateY);
      },
      complete: () => {
        console.log('end');
        setTimeout(function() {
          console.log('-----------');
          turn();
        }, 1000);
      },
    });
}
