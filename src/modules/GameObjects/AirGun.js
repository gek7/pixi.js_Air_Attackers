import * as PIXI from 'pixi.js';
import * as Utils from '../Utils';

export default class AirGun extends PIXI.Container {
    constructor(game) {
        super();
        this.game = game;
        //Зенитка
        this.antiAirGun = new PIXI.Sprite(game.resources.tank.texture);
        this.antiAirGun.scale.x = -1;
        this.addChild(this.antiAirGun);

        //Пушка
        this.gunMovePart = new PIXI.Sprite(game.resources.tank_turret.texture);
        this.gunMovePart.x = this.antiAirGun.x - game.resources.tank_turret.texture.width - 15;
        this.gunMovePart.y = this.antiAirGun.y - game.resources.tank_turret.texture.height + 53;
        this.gunMovePart.scale.x = -1;
        this.gunMovePart.anchor.set(0, 0.5);

        this.addChild(this.gunMovePart);
        this.setChildIndex(this.gunMovePart, 0);
    }

    /**
     * Метод производит выстрел из орудия
     */
    doShot() {
        this.game.bulletsController.createBullet(
            this.x + this.gunMovePart.x,
            this.y + this.gunMovePart.y,
            this.gunMovePart.rotation
        );
    }

    /**
    * Метод направляет орудие танка в переданные координаты
    */
    rotateGun(x, y) {
        let barrelX = this.x + this.gunMovePart.x;
        let barrelY = this.y + this.gunMovePart.y;
        let angle = Utils.calculateAngle(barrelX, barrelY, x, y);

        if (angle < Utils.celsiusToRadian(0)) {
            angle = Utils.celsiusToRadian(0);
        } else if (angle > Utils.celsiusToRadian(100)) {
            angle = Utils.celsiusToRadian(100);
        }

        this.gunMovePart.rotation = angle;
    }
}