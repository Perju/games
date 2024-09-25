import * as ex from "excalibur";
import { loader } from "./assets";
import Player from "./player";
import Drop from "./drop";

var engine = new ex.Engine({
  width: 800,
  height: 600,
  displayMode: ex.DisplayMode.Fixed,
  canvasElementId: "canvas",
});

// use the simple box method or complex rigid body method
ex.Physics.collisionResolutionStrategy = ex.CollisionResolutionStrategy.Box;
engine.backgroundColor = ex.Color.Black;

var player = new Player({
  pos: new ex.Vector(100, 500),
  color: ex.Color.Chartreuse,
});
const lblVidas = new ex.Label(`Vidas: ${player.lives}`, 735, 30);
lblVidas.color = ex.Color.White;

var puntos = 0;
const lblPuntos = new ex.Label("Puntos: 0", 30, 30);
lblPuntos.color = ex.Color.White;
player.on("collisionstart", (e: ex.CollisionStartEvent<Drop>) => {
  if (!Object.is(player.body.collider, e.pair.colliderA)) return;

  let other = e.other as Drop;
  if (other.tipo === 1) {
    player.lives--;
    lblVidas.text = `Vidas: ${player.lives}`;
  } else {
    puntos++;
    lblPuntos.text = `Puntos: ${puntos}`;
  }
  other.del(engine);

  if (player.lives <= 0) {
    engine.goToScene("gameOver");
    canSpawnDrop = false;
  }
});

const rnd = new ex.Random();
var drops: Drop[] = [];
const maxDrops = 10;

const inGame = new ex.Scene(engine);
inGame.on("initialize", () => {
  addDrop();
});

inGame.add(player);
inGame.add(lblPuntos);
inGame.add(lblVidas);

const gameOver = new ex.Scene(engine);
const lblGameOver = new ex.Label("Game Over", 280, 285);
lblGameOver.fontSize = 30;
lblGameOver.color = ex.Color.White;
gameOver.add(lblGameOver);

engine.add("inGame", inGame);
engine.add("gameOver", gameOver);

engine.start(loader).then(() => {
  engine.goToScene("inGame");
});

var canSpawnDrop = true;
const addDrop = () => {
  if (drops.length < maxDrops) {
    var tipo = rnd.integer(0, 1);
    var posX = rnd.integer(0, 584);
    var data = {
      tipo: tipo,
      color: tipo == 0 ? ex.Color.Green : ex.Color.Red,
      arr: drops,
      pos: new ex.Vector(posX, -16),
      acc: new ex.Vector(0, 50),
      body: new ex.Body({
        collider: new ex.Collider({
          type: ex.CollisionType.Active,
          shape: ex.Shape.Box(16, 16),
          offset: new ex.Vector(0, 0),
          group: ex.CollisionGroupManager.groupByName("drops"),
        }),
      }),
    };
    var drop = new Drop(data);
    engine.add(drop);
    drops.push(drop);
  }
  if (canSpawnDrop) setTimeout(addDrop, rnd.integer(1000, 5000));
};
