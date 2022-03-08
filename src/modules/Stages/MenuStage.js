import * as PIXI from 'pixi.js';
import Stage from "./Stage";

export default class MenuStage extends Stage {
    constructor(game) {
        super(game);
        this.resources = PIXI.Loader.shared.resources;
        this.background = new PIXI.Sprite(this.resources.menuBackground.texture);
        this.game.app.stage.addChild(this.background);

        this.startButton = new PIXI.Sprite(this.resources.BTN_START.texture);
        this.startButton.anchor.set(0.5, 0.5);
        this.startButton.y = game.height / 2;
        this.startButton.x = game.width / 2;
        this.startButton.interactive = true;
        this.game.app.stage.addChild(this.startButton);

        this.attachEvents();
    }

    attachEvents() {
        this.startButton.on('mouseup', (e) => {
            this.game.changeStage(this.game.STAGES.PLAY);
        });
    }
}