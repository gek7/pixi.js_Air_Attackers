import * as PIXI from 'pixi.js';

export default class Game {
    constructor(particleModule, App = new PIXI.Application()) {
        const width = App.renderer.width;
        const height = App.renderer.height;
        this.particleModule = particleModule;
        //Земля
        const earth = new PIXI.Graphics();
        earth.beginFill(PIXI.utils.string2hex("#1c941b"));
        earth.drawRect(0, 620, width, 620);
        earth.endFill();
        App.stage.addChild(earth);

        //Солнце
        var sun = new PIXI.Graphics();
        sun.beginFill(0xFFFF00);
        sun.drawEllipse(width - 75, 75, 50, 50);
        sun.endFill();
        App.stage.addChild(sun);


        const container = new PIXI.Container();

        let healths = [];
        //Здоровье
        const health = 1;
        for (let i = 1; i <= health; i++) {
            var heart = new PIXI.Graphics();
            heart.beginFill(PIXI.utils.string2hex("#ff0000"));
            heart.drawEllipse(20 + 60 * i, 40, 20, 20);
            heart.endFill();
            App.stage.addChild(heart);
            healths.push(heart);
        }

        let planes = [];


        App.stage.interactive = true;

        App.stage.on('mouseup', (e) => {
            if (planes.some(planeObj => planeObj.plane === e.target)) {
                App.stage.removeChild(e.target);
                planes.pop();
                particleModule.emitCords("explode", e.data.global.x, e.data.global.y);
            }
        });

        App.ticker.add((delta => {
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
        }));
    }
}