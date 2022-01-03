import * as PIXI from "pixi.js";
import Game from "./modules/Game";
import { fireConfig } from "./modules/ParticleConfigs";
import ParticleModule from "./modules/ParticleModule";

const appCfg = {
    width: 1280,
    height: 720,
    backgroundColor: PIXI.utils.string2hex("#008000"),

};

const imgs = ["particle.png"];

const app = new PIXI.Application({ ...appCfg });
const particleModule = new ParticleModule(app);

//Инициализация объектов, которые будут создавать эффект взрыва
particleModule.createEmitterByConfig("explode", fireConfig);

document.body.appendChild(app.view);

const game = new Game(particleModule, app);

const loader = PIXI.Loader.shared;

for (let i = 0; i < imgs.length; ++i) {
    loader.add('img' + i, urls[i]);
}