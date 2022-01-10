import * as PIXI from 'pixi.js';
export default class Game {
    constructor(particleModule, App = new PIXI.Application()) {
        const width = App.renderer.width;
        const height = App.renderer.height;

        this.resources = PIXI.Loader.shared.resources;

        this.speed = 20;
        this.particleModule = particleModule;

        //Задний фон
        const background = PIXI.Sprite.from('images/background.png');
        background.width = width;
        background.height = height;
        App.stage.addChild(background);
        App.stage.setChildIndex(background, 0);
        //Земля
        const earth = new PIXI.Sprite.from(this.resources.ground.texture);
        earth.y = height - 70;
        earth.width = width;
        App.stage.addChild(earth);

        //Солнце
        const sun = new PIXI.Graphics();
        sun.beginFill(0xFFFF00);
        sun.drawEllipse(width - 75, 75, 50, 50);
        sun.endFill();
        App.stage.addChild(sun);

        //Зенитка
        const antiAirGun = new PIXI.Sprite(this.resources.tank.texture);
        antiAirGun.x = width - this.resources.tank.texture.width + 80;
        antiAirGun.y = height - this.resources.tank.texture.height - 67;
        antiAirGun.scale.x = -1;
        App.stage.addChild(antiAirGun);

        //Пушка
        const gunMovePart = new PIXI.Sprite(this.resources.tank_turret.texture);
        gunMovePart.x = antiAirGun.x - this.resources.tank_turret.texture.width - 15;
        gunMovePart.y = antiAirGun.y - this.resources.tank_turret.texture.height + 53;
        gunMovePart.scale.x = -1;
        App.stage.addChild(gunMovePart);

        App.stage.setChildIndex(gunMovePart, 2);

        gunMovePart.anchor.set(0, 0.5);

        let healths = [];
        //Здоровье
        const health = 3;
        for (let i = 0; i < health; i++) {
            var heart = new PIXI.Sprite(this.resources.heart.texture);
            heart.scale.set(0.5);
            heart.y = 40;
            heart.x = 40 + 100 * i;
            App.stage.addChild(heart);
            healths.push(heart);
        }

        let planes = [];

        let bullets = [];

        App.stage.interactive = true;

        App.stage.on('mouseup', (e) => {

            let angle = this.calculateAngle(
                gunMovePart.x, gunMovePart.y,
                e.data.global.x, e.data.global.y
            );

            if (angle < this.celsiusToRadian(0)) {
                angle = 0;
            } else if (angle >= this.celsiusToRadian(100)) {
                angle = this.celsiusToRadian(100);
            }

            var bullet = PIXI.Sprite.from(this.resources.bullet.texture);
            bullet.scale.set(0.11);
            bullet.anchor.set(0, 0.5);

            bullet.x = gunMovePart.x;
            bullet.y = gunMovePart.y;

            bullets.push({
                obj: bullet,
                angle: angle
            });

            App.stage.addChild(bullet);
            App.stage.setChildIndex(bullet, 1);
        });

        App.stage.on('mousemove', (e) => {

            let angle = this.calculateAngle(gunMovePart.x, gunMovePart.y, e.data.global.x, e.data.global.y);

            if (angle < this.celsiusToRadian(0)) {
                angle = this.celsiusToRadian(0);
            } else if (angle > this.celsiusToRadian(100)) {
                angle = this.celsiusToRadian(100);
            }
            gunMovePart.anchor.set(0, 0.5);
            //Вычитаем Math.PI чтобы спрайт пули правильно отображался в полёте
            gunMovePart.rotation = angle;

        });

        App.ticker.add((delta) => {
            if (planes.length === 0) {
                //Создание самолёта
                const plane = new PIXI.Sprite(this.resources.plane.texture);
                const y = Math.random() * (height / 2);
                const speed = Math.random() * 6 + 3;
                plane.y = y;
                planes.push({ plane, speed });
                App.stage.addChild(plane);
            }
            //Передвижение самолётов
            planes.forEach(p => {
                p.plane.x += p.speed * delta;
                if (p.plane.x >= width) {
                    planes = [];
                    App.stage.removeChild(p.plane);
                    const h = healths.pop();
                    particleModule.emitCords("lifeLost", h.x, h.y);
                    App.stage.removeChild(h);
                    if (!healths.length) {
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
                        text.x = width / 2;
                        text.y = height / 2;
                        const title = App.stage.addChild(text);
                        App.ticker.stop();
                    }
                }
            });

            const boxesIntersect = (a, b) => {
                var ab = a.getBounds();
                var bb = b.getBounds();
                return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
            };

            //Перемещение пуль
            for (let bulletIndex = 0; bulletIndex < bullets.length;) {
                let bullet = bullets[bulletIndex];
                let obj = bullet.obj;

                obj.rotation = bullet.angle;
                obj.x = obj.x - (this.speed * Math.cos(bullet.angle));
                obj.y = obj.y - (this.speed * Math.sin(bullet.angle));

                for (let planeIndex = 0; planeIndex < planes.length;) {
                    let plane = planes[planeIndex];
                    if (boxesIntersect(plane.plane, obj)) {
                        particleModule.emitCords("explode", obj.x, obj.y);
                        App.stage.removeChild(plane.plane);
                        planes.pop();
                        App.stage.removeChild(obj);
                        bullets.splice(bulletIndex, 1);
                        break;
                    }
                    planeIndex++;
                }
                bulletIndex++;
            }
        });
    }

    celsiusToRadian(celsius) {
        return celsius * Math.PI / 180;
    }
    radianToCelsius(radian) {
        return 180 / Math.PI * radian;
    }
    calculateAngle(x1, y1, x2, y2) {
        let subX = x1 - x2;
        let subY = y1 - y2;
        return Math.atan2(subY, subX);
    }
}