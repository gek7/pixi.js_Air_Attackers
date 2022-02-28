import * as PIXI from "pixi.js";
import Game from "./modules/Game";
import { fireConfig, lifeLost } from "./modules/Particles/ParticleConfigs";
import ParticleModule from "./modules/Particles/ParticleModule";
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
//Звуки
loader.add('planeExplode', 'sounds/planeExplode.wav');
loader.add('tankShot', 'sounds/tankShot.wav');
loader.add('backgroundMusic', 'sounds/backgroundMusic.mp3');

loader.load(() => {

    document.querySelector(".container").style.visibility = "collapse";

    const particleModule = new ParticleModule(app);

    //Инициализация объектов, которые будут создавать эффект взрыва
    particleModule.createEmitterByConfig("explode", fireConfig);
    //Инициализация объектов, которые будут создавать эффект потери жизни
    particleModule.createEmitterByConfig("lifeLost", lifeLost);

    console.log("loaded");
    new Game(particleModule, app);
});