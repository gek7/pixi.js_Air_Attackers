import { Container } from "pixi.js";
import Game from "../Game";

export default class Stage {
    constructor(game) { this.game = game; }
    update(delta) { }
    clearScene() {
        this.game.app.stage.destroy();
        this.game.app.stage = new Container();
    }
}