import * as PIXI from 'pixi.js';
import * as Utils from './Utils.js';
export default class Game {
    constructor(particleModule, app) {

        const backgroundMusic = new Audio("sounds/backgroundMusic.mp3");
        backgroundMusic.volume = 0.2;
        backgroundMusic.play();
        this.app = app;
        this.width = this.app.renderer.width;
        this.height = this.app.renderer.height;
        this.resources = PIXI.Loader.shared.resources;
        this.speed = 20;
        this.particleModule = particleModule;
        this.MaxHealth = 3;
        //Здесь будут объекты здоровья
        this.healths = [];

        //Задний фон
        const background = PIXI.Sprite.from('images/background.png');
        background.width = this.width;
        background.height = this.height;
        this.app.stage.addChild(background);
        this.app.stage.setChildIndex(background, 0);

        //Земля
        const earth = new PIXI.Sprite.from(this.resources.ground.texture);
        earth.y = this.height - 70;
        earth.width = this.width;
        this.app.stage.addChild(earth);

        //Солнце
        const sun = new PIXI.Graphics();
        sun.beginFill(0xFFFF00);
        sun.drawEllipse(this.width - 75, 75, 50, 50);
        sun.endFill();
        this.app.stage.addChild(sun);

        //Зенитка
        this.antiAirGun = new PIXI.Sprite(this.resources.tank.texture);
        this.antiAirGun.x = this.width - this.resources.tank.texture.width + 80;
        this.antiAirGun.y = this.height - this.resources.tank.texture.height - 67;
        this.antiAirGun.scale.x = -1;
        this.app.stage.addChild(this.antiAirGun);

        //Пушка
        this.gunMovePart = new PIXI.Sprite(this.resources.tank_turret.texture);
        this.gunMovePart.x = this.antiAirGun.x - this.resources.tank_turret.texture.width - 15;
        this.gunMovePart.y = this.antiAirGun.y - this.resources.tank_turret.texture.height + 53;
        this.gunMovePart.scale.x = -1;
        this.gunMovePart.anchor.set(0, 0.5);

        this.app.stage.addChild(this.gunMovePart);
        this.app.stage.setChildIndex(this.gunMovePart, 2);

        for (let i = 0; i < this.MaxHealth; i++) {
            var heart = new PIXI.Sprite(this.resources.heart.texture);
            heart.scale.set(0.5);
            heart.y = 40;
            heart.x = 40 + 100 * i;
            this.app.stage.addChild(heart);
            this.healths.push(heart);
        }

        this.planes = [];

        this.bullets = [];

        this.app.stage.interactive = true;

        this.app.stage.on('mouseup', (e) => {
            this.doShot();
        });

        this.app.stage.on('mousemove', (e) => {
            this.rotateGun(e.data.global.x, e.data.global.y);
        });

        this.app.ticker.add((delta) => {
            if (this.planes.length === 0) {
                this.createPlane();
            }
            this.movePlanes(delta);
            this.moveBullets(delta);
        });
    }
    /**
     * Создаёт новый самолёт
     */
    createPlane() {
        const plane = new PIXI.Sprite(this.resources.plane.texture);
        const y = Math.random() * (this.height / 2);
        const speed = Math.random() * 6 + 3;
        plane.y = y;
        this.planes.push({ plane, speed });
        this.app.stage.addChild(plane);
    }

    /**
     * Перемещает самолёт в зависимости от его скорости
     * @param {Number} delta 
     */
    movePlanes(delta) {
        this.planes.forEach(p => {
            p.plane.x += p.speed * delta;
            if (p.plane.x >= this.width) {
                this.planes = [];
                this.app.stage.removeChild(p.plane);
                const h = this.healths.pop();
                this.particleModule.emitCords("lifeLost", h.x, h.y);
                this.app.stage.removeChild(h);
                if (!this.healths.length) {
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
                    text.anchor.set(0.5);
                    text.x = this.width / 2;
                    text.y = this.height / 2;
                    const title = this.app.stage.addChild(text);
                    this.app.ticker.stop();
                }
            }
        });
    }

    /**
     * Перемещает пули от скорости, заданной в this.speed
     * @param {Number} delta 
     */
    moveBullets(delta) {
        //Перемещение пуль
        for (let bulletIndex = 0; bulletIndex < this.bullets.length;) {
            let bullet = this.bullets[bulletIndex];
            let obj = bullet.obj;

            obj.rotation = bullet.angle;
            obj.x = obj.x - (this.speed * Math.cos(bullet.angle)) * delta;
            obj.y = obj.y - (this.speed * Math.sin(bullet.angle)) * delta;

            //Если пуля выходит за границы игры, то убираем её из игры
            if (obj.x > this.app.width || obj.y > this.app.height) {
                this.app.stage.removeChild(obj);
                this.bullets.splice(bulletIndex, 1);
                continue;
            }

            for (let planeIndex = 0; planeIndex < this.planes.length;) {
                let plane = this.planes[planeIndex];
                if (Utils.boxesIntersect(plane.plane, obj)) {
                    this.particleModule.emitCords("explode", obj.x, obj.y);
                    this.app.stage.removeChild(plane.plane);
                    this.planes.pop();
                    this.app.stage.removeChild(obj);
                    this.bullets.splice(bulletIndex, 1);
                    bullet.sound.pause();
                    const explode = new Audio("sounds/planeExplode.wav");
                    explode.volume = 0.1;
                    explode.play();
                    break;
                }
                planeIndex++;
            }
            bulletIndex++;
        }
    }

    /**
     * Функция направляет орудие танка в переданные координаты
     */
    rotateGun(x, y) {
        let angle = Utils.calculateAngle(this.gunMovePart.x, this.gunMovePart.y, x, y);

        if (angle < Utils.celsiusToRadian(0)) {
            angle = Utils.celsiusToRadian(0);
        } else if (angle > Utils.celsiusToRadian(100)) {
            angle = Utils.celsiusToRadian(100);
        }

        this.gunMovePart.rotation = angle;
    }

    /**
     * Функция производит выстрел из орудия
     */
    doShot() {
        var bullet = PIXI.Sprite.from(this.resources.bullet.texture);
        bullet.scale.set(0.11);
        bullet.anchor.set(0, 0.5);

        bullet.x = this.gunMovePart.x;
        bullet.y = this.gunMovePart.y;
        const shotSound = new Audio("./sounds/tankShot.wav");
        shotSound.volume = 0.1;
        this.bullets.push({
            obj: bullet,
            angle: this.gunMovePart.rotation,
            sound: shotSound
        });

        this.app.stage.addChild(bullet);
        this.app.stage.setChildIndex(bullet, 1);
        shotSound.play();
    }
}