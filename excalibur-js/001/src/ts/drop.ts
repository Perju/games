import * as ex from "excalibur";

export default class Drop extends ex.Actor {
  public tipo: number;
  public arr: Drop[];

  constructor(data) {
    super(data);
    this.tipo = data.tipo;
    this.arr = data.arr;
  }

  public update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);
    if (this.pos.y > 600) {
      this.del(engine);
    }
  }

  public del(engine: ex.Engine) {
    const index = this.arr.indexOf(this);
    this.arr.splice(index, index);
    engine.remove(this);
  }
}
