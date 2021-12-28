import {Vector} from './vector.js'
import {ctx} from '../script.js';



export class Obstacle {
    position: Vector;
    radius: number;
    color: string = "";
    img: HTMLImageElement;
  
    constructor(
      position: Vector,
      radius: number,
      color: string,
      img: HTMLImageElement
    ) {
      this.position = position;
      this.radius = radius;
      this.color = color;
      this.img = img;
    }
  
    draw() {
      ctx?.save();
      ctx?.translate(this.position.x, this.position.y);
  
      // ctx?.beginPath();
      // ctx?.arc(0, 0, this.radius, 0, Math.PI * 2);
      // ctx!.fillStyle = this.color;
      // ctx?.fill();
      // ctx?.stroke();
      // ctx?.closePath;
      let r = this.radius * 1.4;
      ctx?.drawImage(this.img, -r, -r, r * 2, r * 2);
      ctx?.restore();
    }
  }