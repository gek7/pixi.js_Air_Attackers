import * as PIXI from 'pixi.js';
import AirGun from '../GameObjects/AirGun';
import Background from '../GameObjects/Background.js';
import EnemyController from '../Controllers/EnemyController.js';
import BulletsController from '../Controllers/BulletsController';
import ParticleModule from '../Particles/ParticleModule';
import { lifeLost, fireConfig } from '../Particles/ParticleConfigs';
import Stage from "./Stage";
import { Sprite } from 'pixi.js';

export default class PlayStage extends Stage {
    constructor(game) {
        super(game);
        this.app = game.app;
        this.width = game.width;
        this.height = game.height;
        this.resources = PIXI.Loader.shared.resources;
        this.particleModule = game.particleModule;
        this.app.stage.interactive = true;
        this.MaxHealth = 3;
        this.healths = [];
        this.isPaused = false;

        this.particleModule = new ParticleModule(this.app);

        //Инициализация объектов, которые будут создавать эффект взрыва
        this.particleModule.createEmitterByConfig("explode", fireConfig);

        //Инициализация объектов, которые будут создавать эффект потери жизни
        this.particleModule.createEmitterByConfig("lifeLost", lifeLost);

        this.resources.backgroundMusic.sound.volume = 0.04;
        this.resources.backgroundMusic.sound.play();

        //Объект, который создаёт  и перемещает вражеские самолёты
        this.enemyController = new EnemyController(this);

        //Объект, который создаёт и перемещает снаряды
        this.bulletsController = new BulletsController(this);

        this.createHealths();

        this.paint();

        this.attachEvents();
    }

    paint() {
        //Фон
        if (this.background) {
            this.app.stage.removeChild(this.background);
            this.background = null;
        }
        this.background = new Background(this);
        this.app.stage.addChild(this.background);
        this.app.stage.setChildIndex(this.background, 0);

        if (this.airGun) {
            this.app.stage.removeChild(this.airGun);
            this.airGun = null;
        }

        //Зенитка
        this.airGun = new AirGun(this);
        this.airGun.x = this.width - this.resources.tank.texture.width + 80;
        this.airGun.y = this.height - this.resources.tank.texture.height - 67;
        this.app.stage.addChild(this.airGun);
        this.app.stage.setChildIndex(this.airGun, 1);

        //Кнопка паузы
        this.pauseBtn = new Sprite(this.resources.BTN_PAUSE.texture);
        this.pauseBtn.x = this.width - 125;
        this.pauseBtn.y = 25;
        this.pauseBtn.width = 100;
        this.pauseBtn.height = 100;
        this.pauseBtn.interactive = true;
        this.app.stage.addChild(this.pauseBtn);
        this.app.stage.setChildIndex(this.pauseBtn, 1);

        this.paintHealths();
    }


    update(delta) {
        if (!this.isPaused) {
            this.enemyController.movePlanes(delta);
            this.bulletsController.moveBullets(delta);
        }
    }

    clearScene() {
        Stage.prototype.clearScene.call(this);
        this.resources.backgroundMusic.sound.stop();
    }

    /**
     * Метод направляет орудие на переданные координаты
     */
    rotateGun(x, y) {
        x = x / this.game.app.stage.scale.x;
        y = y / this.game.app.stage.scale.y;
        this.airGun.rotateGun(x, y);
    }

    attachEvents() {
        this.app.stage.on('pointerdown', (e) => {
            if (!this.isPaused && e.target !== this.pauseBtn) {
                if (!this.isLosed) {
                    this.rotateGun(e.data.global.x, e.data.global.y);
                    this.airGun.doShot();
                } else {
                    this.game.changeStage(this.game.STAGES.MENU);
                }
            }
        });

        this.app.stage.on('mousemove', (e) => {
            if (!this.isPaused && !this.isLosed) {
                this.rotateGun(e.data.global.x, e.data.global.y);
            }
        });

        this.pauseBtn.on('mouseover', (e) => {
            this.pauseBtn.texture = this.resources.BTN_PAUSE_MOUSE_UP.texture;
        });
        this.pauseBtn.on('mouseout', (e) => {
            this.pauseBtn.texture = this.resources.BTN_PAUSE.texture;
        });
        this.pauseBtn.on('pointerdown', (e) => {
            this.pauseGame();
        });

        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    createHealths() {
        for (let i = 0; i < this.MaxHealth; i++) {
            var heart = new PIXI.Sprite(this.resources.heart.texture);
            this.healths.push(heart);
        }
    }

    paintHealths() {
        const defaultHeartScale = 0.5;

        for (let i = 0; i < this.healths.length; i++) {
            const heart = this.healths[i];
            heart.scale.set(defaultHeartScale);

            if (this.app.stage.children.indexOf(heart) > -1) {
                this.app.stage.removeChild(heart);
            }

            const offset = heart.width / 4;
            heart.y = offset;
            heart.x = offset + ((heart.width + heart.width / 8) * i);
            this.app.stage.addChild(heart);
        }
    }


    pauseGame() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.resources.backgroundMusic.sound.pause();
        } else {
            this.resources.backgroundMusic.sound.resume();
        }
    }

    onKeyDown(e) {
        if (e.key == "Escape") {
            this.pauseGame();
        }
    }
}