import { hypo } from "../script.js";
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
        return hypo(this.x, this.y);
    }
}
//# sourceMappingURL=vector.js.map