export class Vector {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    multiply(m) {
        return new Vector(this.x * m, this.y * m);
    }
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    normalise() {
        return new Vector(this.x / this.length, this.y / this.length);
    }
    get length() {
        return Vector.hypo(this.x, this.y);
    }
    static hypo(adjacent, opposite) {
        return Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
    }
    static distanceBetween(a, b) {
        return Vector.hypo(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    }
    static trueVector(o) {
        return new Vector(o.x, o.y);
    }
}
//# sourceMappingURL=vector.js.map