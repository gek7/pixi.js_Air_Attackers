import * as PIXI from 'pixi.js';

export default class Game {
    constructor(particleModule, App = new PIXI.Application()) {
        const width = App.renderer.width;
        const height = App.renderer.height;

        this.speed = 20;
        this.particleModule = particleModule;

        //Земля
        const earth = new PIXI.Graphics();
        earth.beginFill(PIXI.utils.string2hex("#1c941b"));
        earth.drawRect(0, 620, width, 620);
        earth.endFill();
        App.stage.addChild(earth);

        //Солнце
        const sun = new PIXI.Graphics();
        sun.beginFill(0xFFFF00);
        sun.drawEllipse(width - 75, 75, 50, 50);
        sun.endFill();
        App.stage.addChild(sun);

        //Зенитка
        const antiAirGun = new PIXI.Graphics();
        antiAirGun.beginFill(PIXI.utils.string2hex("#FF69B4"));
        antiAirGun.drawRect(width - 200, 520, 100, 100);
        antiAirGun.endFill();
        App.stage.addChild(antiAirGun);

        let healths = [];
        //Здоровье
        const health = 3;
        for (let i = 1; i <= health; i++) {
            var heart = new PIXI.Graphics();
            heart.beginFill(PIXI.utils.string2hex("#ff0000"));
            heart.drawEllipse(20 + 60 * i, 40, 20, 20);
            heart.endFill();
            App.stage.addChild(heart);
            healths.push(heart);
        }

        let planes = [];

        let bullets = [];

        App.stage.interactive = true;

        App.stage.on('mouseup', (e) => {

            var hit = PIXI.Sprite.from('bullet.png');
            hit.width = 50;
            hit.height = 50;
            hit.anchor.set(0.5);
            //hit.beginFill(PIXI.utils.string2hex("#ff0000"));
            //hit.drawEllipse(width - 200, 520, 10, 10);
            //hit.endFill();

            hit.x = width - 200;
            hit.y = 520;

            bullets.push({
                obj: hit,
                startPoint: { x: width - 200, y: 520 },
                endPoint: { x: e.data.global.x, y: e.data.global.y }
            });

            App.stage.addChild(hit);
        });

        App.ticker.add((delta) => {
            if (planes.length === 0) {
                //Создание самолёта
                const plane = new PIXI.Graphics();
                plane.interactive = true;
                plane.beginFill(PIXI.utils.string2hex("#42aaff"));
                const randomHeight = Math.random() * (height / 2);
                const speed = Math.random() * 6 + 3;
                plane.drawRect(-100, randomHeight + 50, 100, 50);
                plane.endFill();
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
                let subX = bullet.startPoint.x - bullet.endPoint.x; // 10
                let subY = bullet.startPoint.y - bullet.endPoint.y; // 10
                let angle = Math.atan2(subY, subX);

                //Вычитаем Math.PI чтобы спрайт пули правильно отображался в полёте
                obj.rotation = angle - (Math.PI / 2);
                obj.x = obj.x - (this.speed * Math.cos(angle));
                obj.y = obj.y - (this.speed * Math.sin(angle));

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
}