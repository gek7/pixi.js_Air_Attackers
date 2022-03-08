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
        this.width = this.app.renderer.width;
        this.height = this.app.renderer.height;
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
    }
}