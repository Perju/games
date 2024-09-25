import * as ex from "excalibur";

export default class Player extends ex.Actor {
  public velocidad = 200;
  public name: string;

  public lives: number = 3;
  private kb: ex.Input.Keyboard;
  private keys = ex.Input.Keys;

  // Array with keys and function to check movement
  private moveBinds = [
    {
      keys: [this.keys.A, this.keys.Left],
      action: "left",
    },
    {
      keys: [this.keys.D, this.keys.Right],
      action: "right",
    },
  ];

  constructor(data) {
    super({
      pos: data.pos,
      color: data.color,
      body: new ex.Body({
        collider: new ex.Collider({
          type: ex.CollisionType.Passive,
          shape: ex.Shape.Box(64, 64),
          offset: new ex.Vector(0, 0),
          group: ex.CollisionGroupManager.groupByName("players"),
        }),
      }),
    });

    this.id = data.id;
    this.name = data.name;
  }

  public onInitialize(engine: ex.Engine) {
    this.kb = engine.input.keyboard;

    this.body.collider.mass = 500;
    this.body.collider.bounciness = 0.5;
    this.body.collider.friction = 0.79;
    this.body.collider.inertia = 500;
  }

  public update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);

    /// Limit speed and rotation
    this.rotation = 0;
    this._speedControl();

    /// Check user input
    this._checkControls(engine, delta);
  }

  private _checkControls(engine: ex.Engine, delta: number) {
    const kb = engine.input.keyboard;

    this.moveBinds.forEach((bind) => {
      this._checkBindings(bind, delta);
    });
  }

  private _checkBindings(bind, delta) {
    const kb = this.kb;
    bind.keys.forEach((key, i) => {
      if (kb.isHeld(key)) this._actions(bind.action, delta);
    });
  }

  private _actions(action: string, delta: number) {
    if (action === "left") this.vel.x -= 2 * delta;
    else if (action === "right") this.vel.x += 2 * delta;
  }

  // Speed control
  private _speedControl() {
    const curVelX = this.body.vel.x;
    const curVelY = this.body.vel.y;
    // limit speed
    this._maxSpeed(curVelX, curVelY);
    // reduce speed
    this._reduceSpeed(curVelX, curVelY);
  }

  private _maxSpeed(x, y) {
    if (x >= this.velocidad || x <= -this.velocidad) {
      this.body.vel.x = x > 0 ? this.velocidad : -this.velocidad;
    }
    if (y >= this.velocidad || y <= -this.velocidad) {
      this.body.vel.y = y > 0 ? this.velocidad : -this.velocidad;
    }
  }

  private _reduceSpeed(x, y) {
    const vel = Math.abs(x) > 5 ? 5 : 1;
    if (x === 0) this.body.vel.x = 0;
    else if (x > 0) this.body.vel.x -= vel;
    else if (x < 0) this.body.vel.x += vel;
  }
  // End speed control
}
