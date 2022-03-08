import * as PIXI from 'pixi.js';
import * as Utils from '../Utils.js';

export default class EnemiesController {
    constructor(game) {
        this.planes = [];
        this.game = game;
        this.createPlane();
    }

    /**
    * Создаёт новый самолёт
    */
    createPlane() {
        const plane = new PIXI.Sprite(this.game.resources.plane.texture);
        const y = Math.random() * (this.game.height / 2);
        const speed = Math.random() * 6 + 3;
        plane.y = y;
        this.planes.push({ plane, speed });
        this.game.app.stage.addChild(plane);
    }

    /**
     * Перемещает самолёт в зависимости от его скорости
     * @param {Number} delta 
     */
    movePlanes(delta) {
        this.planes.forEach(p => {
            p.plane.x += p.speed * delta;
            if (p.plane.x >= this.game.width) {
                this.planes = [];
                this.game.app.stage.removeChild(p.plane);
                const healthObj = this.game.healths.pop();
                this.game.particleModule.emitCords("lifeLost", healthObj.x, healthObj.y);
                this.game.app.stage.removeChild(healthObj);
                if (!this.game.healths.length) {
                    const style = new PIXI.TextStyle({
                        dropShadowAngle: 0.6,
                        dropShadowBlur: 1,
                        dropShadowDistance: 4,
                        fill: "#f05c5c",
                        fontFamily: "Impact",
                        letterSpacing: 4,
                        strokeThickness: 4,
                        fontSize: 75
                    });
                    const text = new PIXI.Text('YOU LOSE', style);
                    this.game.isLosed = true;
                    text.anchor.set(0.5);
                    text.x = this.game.width / 2;
                    text.y = this.game.height / 2;
                    this.game.app.stage.addChild(text);
                    this.game.app.stage.setChildIndex(text, 2);
                }
            }
        });

        if (this.planes.length == 0 && this.game.healths.length > 0) {
            this.createPlane();
        }
    }

    /**
     * Проверка на попадание по вражескому объекту
     * @param {*} bulletObj объект снаряда
     * @returns Есть попадание?
     */
    tryHitEnemy(bulletObj) {
        for (let planeIndex = 0; planeIndex < this.planes.length; planeIndex++) {
            let plane = this.planes[planeIndex];
            if (Utils.boxesIntersect(plane.plane, bulletObj)) {
                this.game.particleModule.emitCords("explode", bulletObj.x, bulletObj.y);
                this.game.app.stage.removeChild(plane.plane);
                this.planes.pop();
                this.game.resources.planeExplode.sound.volume = 0.03;
                this.game.resources.planeExplode.sound.play();
                return true;
            }
        }
        return false;
    }
}