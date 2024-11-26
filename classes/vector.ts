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

  distanceFrom(b:Vector):number{
    return Vector.hypo(this.x-b.x,this.y-b.y)
  }

  subIn(v: Vector): void {
    this.x -= v.x;
    this.y -= v.y;
  }
  addIn(v: Vector): void {
    this.x += v.x;
    this.y += v.y;
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

  static trueVector(o: any){
    return new Vector(o.x,o.y)
  }

  static hypo(adjacent: number, opposite: number) {
    return Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
  }
  static distanceBetween(a: Vector, b: Vector) {
    return Vector.hypo(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
  }

  rotate(angle: number): Vector {
    let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    let y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    return new Vector(x, y);

  }

  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
  }


cross(b:Vector):number{ 
    let a=this
    return (a.x*b.y) - (a.y*b.x);        


}

closestPointOnLine(a:Vector,b:Vector):Vector{
  const ab=(b.subtract(a))
  const abn = ab.normalise()
  const dp = this.subtract(a).dot(abn)  
  return a.add(abn.multiply(dp))
}

distanceFromLine(a:Vector,b:Vector):number{                
  return this.closestPointOnLine(a,b).distanceFrom(this)
}

clone():Vector{
  return new Vector(this.x,this.y)
}


  // reversed shooting
 static negate(r: any){
    return new Vector(-r.x,-r.y)
  }
}
