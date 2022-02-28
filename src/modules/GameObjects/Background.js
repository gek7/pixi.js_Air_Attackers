import * as PIXI from 'pixi.js';

export default class Background extends PIXI.Container {
    constructor(game) {
        super();
        this.game = game;
        //Задний фон
        const background = new PIXI.Sprite(game.resources.background.texture);
        background.width = game.width;
        background.height = game.height;
        this.addChild(background);

        //Земля
        const earth = new PIXI.Sprite(game.resources.ground.texture);
        earth.y = game.height - 70;
        earth.width = game.width;
        this.addChild(earth);

        //Солнце
        const sun = new PIXI.Graphics();
        sun.beginFill(0xFFFF00);
        sun.drawEllipse(game.width - 75, 75, 50, 50);
        sun.endFill();
        this.addChild(sun);
    }
}