import { hypo } from "../script.js";

export class Vector {
    x: number = 0;
    y: number = 0;
  
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  
    add(v: Vector): Vector {
      return new Vector(this.x + v.x, this.y + v.y);
    }
    multiply(m: number): Vector {
      return new Vector(this.x * m, this.y * m);
    }
    subtract(v: Vector): Vector {
      return new Vector(this.x - v.x, this.y - v.y);
    }
    normalise() {
      return new Vector(this.x / this.length, this.y / this.length);
    }
    get length() {
      return hypo(this.x, this.y);
    }
  }
  