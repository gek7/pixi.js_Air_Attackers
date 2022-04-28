import * as PIXI from 'pixi.js';
import Stage from './Stages/Stage';
import PlayStage from './Stages/PlayStage.js';
import MenuStage from './Stages/MenuStage.js';
/**
 TODO:
    add posibility change music volume
*/
export default class Game {
    constructor(app) {
        this.app = app;

        this.defaultRendererWidth = 1280;
        this.defaultRendererHeight = 720;

        this.width = this.defaultRendererWidth;
        this.height = this.defaultRendererHeight;

        window.onresize = (() => this.resize()).bind(this);
        this.STAGES = {
            "PLAY": PlayStage,
            "MENU": MenuStage
        };

        this.changeStage(this.STAGES.MENU);
    }

    changeStage(stageType) {
        let stageClass;
        if (stageType && stageType.prototype instanceof Stage) {
            stageClass = stageType;
        } else if (stageType.prototype instanceof String) {
            stageClass = this.STAGES[stageType];
        }

        if (stageClass) {
            if (this.stage) {
                this.stage.clearScene();
                this.gameTicker.destroy();
            }
            this.stage = new stageClass(this);
            this.gameTicker = new PIXI.Ticker();
            this.gameTicker.add(this.stage.update.bind(this.stage));
            this.gameTicker.start();

        } else {
            throw "Невозможно переключить состояние";
        }
        this.resize();
    }


    resize() {
        const renderWidth = document.documentElement.clientWidth;
        const renderHeight = document.documentElement.clientHeight;
        const widthRatio = renderWidth / this.defaultRendererWidth;
        const heightRatio = renderHeight / this.defaultRendererHeight;

        //Берём минимальную сторону пользовательской игровой зоны, чтобы уместить туда игру
        const newScale = widthRatio > heightRatio ? heightRatio : widthRatio;

        this.app.stage.scale.set(newScale);

        this.app.renderer.resize(this.defaultRendererWidth * newScale, this.defaultRendererHeight * newScale);
    }
}