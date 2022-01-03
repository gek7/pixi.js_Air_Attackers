import * as PIXI from "pixi.js";
import Game from "./modules/Game";
import { fireConfig } from "./modules/ParticleConfigs";
import ParticleModule from "./modules/ParticleModule";

const appCfg = {
    width: 1280,
    height: 720,
    backgroundColor: PIXI.utils.string2hex("#008000"),

};

const app = new PIXI.Application({ ...appCfg });

//Задний фон

const background = new PIXI.Graphics();
background.beginFill(PIXI.utils.string2hex("#008000"));
background.drawRect(0, 0, appCfg.width, appCfg.height);
background.endFill();
app.stage.addChild(background);

const particleModule = new ParticleModule(app);

//Инициализация объектов, которые будут создавать эффект взрыва
particleModule.createEmitterByConfig("explode", fireConfig);

document.body.appendChild(app.view);

const game = new Game(particleModule, app);

const loader = PIXI.Loader.shared;