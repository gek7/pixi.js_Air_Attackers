import * as PIXI from "pixi.js";
import Game from "./modules/Game";
import { sound } from "@pixi/sound";

const appCfg = {
    width: 1280,
    height: 720,
    backgroundColor: PIXI.utils.string2hex("#00000")
};


let app = new PIXI.Application({ ...appCfg });
document.querySelector("#canvasWrapper").appendChild(app.view);

const loader = PIXI.Loader.shared;
//Спрайты (В будущем сделать SpriteSheet)
loader.add("tank", "images/tank.png");
loader.add("ground", "images/groundGrass.png");
loader.add("background", "images/background.png");
loader.add("bullet", "images/bullet.png");
loader.add("fire", "images/fire.png");
loader.add("fire2", "images/fire2.png");
loader.add("tank_turret", "images/tank_turret.png");
loader.add("heart", "images/heart.png");
loader.add("plane", "images/plane.png");
loader.add("menuBackground", "images/menuBackground.png");
loader.add("BTN_START", "images/BTN_START.png");
//Звуки
loader.add('planeExplode', 'sounds/planeExplode.wav');
loader.add('tankShot', 'sounds/tankShot.wav');
loader.add('backgroundMusic', 'sounds/backgroundMusic.mp3');

loader.load(() => {

    document.querySelector(".container").style.visibility = "collapse";

    console.log("loaded");
    new Game(app);
});