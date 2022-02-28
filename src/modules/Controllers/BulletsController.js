import * as PIXI from 'pixi.js';

export default class BulletsController {
    constructor(game) {
        this.bullets = [];
        this.speed = 20;
        this.game = game;
    }

    /**
    * Создаёт новый самолёт
    */
    createBullet(initialX, initialY, angle) {
        console.dir("ada");
        let bullet = new PIXI.Sprite(this.game.resources.bullet.texture);
        bullet.scale.set(0.11);
        bullet.anchor.set(0, 0.5);
        bullet.x = initialX;
        bullet.y = initialY;
        //Воспроизводим звук выстрела
        this.game.resources.tankShot.sound.volume = 0.01;
        this.game.resources.tankShot.sound.play();

        this.bullets.push({
            obj: bullet,
            angle: angle
        });

        this.game.app.stage.addChild(bullet);
        this.game.app.stage.setChildIndex(bullet, 1);
    }

    /**
     * Перемещает пули от скорости, заданной в this.speed
     * @param {Number} delta 
     */
    moveBullets(delta) {
        //Перемещение пуль
        for (let bulletIndex = 0; bulletIndex < this.bullets.length; bulletIndex++) {
            let bullet = this.bullets[bulletIndex];
            let bulletObj = bullet.obj;

            bulletObj.rotation = bullet.angle;
            bulletObj.x = bulletObj.x - (this.speed * Math.cos(bullet.angle)) * delta;
            bulletObj.y = bulletObj.y - (this.speed * Math.sin(bullet.angle)) * delta;

            //Если пуля выходит за границы игры, то убираем её из игры
            if (bulletObj.x > this.game.app.width || bulletObj.y > this.game.app.height) {
                this.game.app.stage.removeChild(bulletObj);
                this.bullets.splice(bulletIndex, 1);
                continue;
            }
            //Проверяем, если пуля попала по вражескому объекту
            if (this.game.enemyController.tryHitEnemy(bulletObj)) {
                this.bullets.splice(bulletIndex, 1);
                this.game.app.stage.removeChild(bulletObj);
            }
        }
    }
}