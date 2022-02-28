import * as PIXI from "pixi.js";
import { Emitter } from "@pixi/particle-emitter";

/**
 * Экземпляр этого класса управляет всеми анимациями частиц приложения
 */
export default class ParticleModule {
    constructor(app) {

        this.emitters = {};
        this.particleStage = new PIXI.Container();
        app.stage.addChild(this.particleStage);
        this.particleStage.width = app.renderer.width;
        this.particleStage.height = app.renderer.height;

        let elapsed = Date.now();

        //Обновляет все объекты, которые могут запросить анимацию
        const update = () => {
            // Update the next frame
            requestAnimationFrame(update);
            const now = Date.now();
            if (Object.values(this.emitters).length > 0) {
                for (let key in this.emitters) {
                    this.emitters[key].update((now - elapsed) * 0.001);
                }
            }

            elapsed = now;
        };

        update();
    }

    /**
     * Создаёт emitter, который может в дальнейшем
     * воспроизвести анимацию по параметрам переданной конфигурации
     * @param {String} emitterName - Название, по которому можно запросить emitter
     * @param {Object} emitterConfig - Конфигурация нового emittera
     * @returns Созданный emitter
     */
    createEmitterByConfig(emitterName, emitterConfig) {
        const emitter = new Emitter(
            this.particleStage,
            emitterConfig
        );
        emitter.emit = false;
        this.emitters[emitterName] = emitter;
        return emitter;
    }

    /**
     * Ищет emitter по имени и запускает у него анимацию
     * @param {String} emitterName - название emitter-а
     */
    emit(emitterName) {
        if (this.emitters[emitterName]) {
            this.emitters[emitterName].emit = true;
        } else {
            console.log("Не удалось найти emitter по имени " + emitterName);
        }
    }

    /**
     * Ищет emitter по имени и запускает у него анимацию
     * в переданных координатах x и y
     * @param {String} emitterName - название emitter-а
     * @param {Number} x - координата x
     * @param {Number} y - координата y
     */
    emitCords(emitterName, x, y) {
        this.emitters[emitterName].emit = true;
        this.emitters[emitterName].resetPositionTracking();
        this.emitters[emitterName].updateOwnerPos(x, y);
    }
}