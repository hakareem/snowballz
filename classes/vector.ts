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
    return Vector.hypo(this.x, this.y);
  }
  static hypo(adjacent: number, opposite: number) {
    return Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
  }
  static distanceBetween(a: Vector, b: Vector) {
    return Vector.hypo(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
  }
}
