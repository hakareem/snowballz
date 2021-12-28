import {Vector} from './vector.js'
import {ctx, canvas} from '../script.js';


export class Camera {
    static focus: Vector = new Vector(0, 0);  
  
    static update(v: Vector) {
      Camera.focus = v;
      ctx?.translate(-v.x + canvas.width / 2, -v.y + canvas.height / 2);
    }
  }
  