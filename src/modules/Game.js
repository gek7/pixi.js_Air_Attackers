import * as PIXI from 'pixi.js';
import AirGun from './GameObjects/AirGun.js';
import Background from './GameObjects/Background.js';
import EnemyController from './Controllers/EnemyController.js';
import BulletsController from './Controllers/BulletsController';

/**
 TODO:
    - Stage modes (MENU, PAUSE)
    - Add replay logic after lose
*/
export default class Game {
    constructor(particleModule, app) {
        this.app = app;
        this.width = this.app.renderer.width;
        this.height = this.app.renderer.height;
        this.resources = PIXI.Loader.shared.resources;
        this.particleModule = particleModule;
        this.app.stage.interactive = true;
        //Скорость снаряда
        this.speed = 20;
        this.MaxHealth = 3;

        this.bullets = [];
        this.healths = [];

        this.resources.backgroundMusic.sound.volume = 0.04;
        this.resources.backgroundMusic.sound.play();

        //Фон
        this.background = new Background(this);
        this.app.stage.addChild(this.background);
        this.app.stage.setChildIndex(this.background, 0);

        //Зенитка
        this.airGun = new AirGun(this);
        this.airGun.x = this.width - this.resources.tank.texture.width + 80;
        this.airGun.y = this.height - this.resources.tank.texture.height - 67;
        this.app.stage.addChild(this.airGun);
        this.app.stage.setChildIndex(this.airGun, 1);

        //Объект, который создаёт  и перемещает вражеские самолёты
        this.enemyController = new EnemyController(this);

        //Объект, который создаёт и перемещает снаряды
        this.bulletsController = new BulletsController(this);

        this.createHealths();

        this.attachEvents();

        this.app.ticker.add((delta) => {
            this.enemyController.movePlanes(delta);
            this.bulletsController.moveBullets(delta);
        });
    }

    /**
     * Метод направляет орудие на переданные координаты
     */
    rotateGun(x, y) {
        this.airGun.rotateGun(x, y);
    }

    attachEvents() {
        this.app.stage.on('mouseup', (e) => {
            this.airGun.doShot();
        });

        this.app.stage.on('mousemove', (e) => {
            this.rotateGun(e.data.global.x, e.data.global.y);
        });
    }

    createHealths() {
        for (let i = 0; i < this.MaxHealth; i++) {
            var heart = new PIXI.Sprite(this.resources.heart.texture);
            heart.scale.set(0.5);
            heart.y = 40;
            heart.x = 40 + 100 * i;
            this.app.stage.addChild(heart);
            this.healths.push(heart);
        }
    }
}