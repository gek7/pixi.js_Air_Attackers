import { fireConfig } from "./ParticleConfigs";
import * as PIXI from "pixi.js";
import { Emitter } from "@pixi/particle-emitter";

export default class ParticleModule {
    constructor(app) {

        this.emitters = {};
        this.particleStage = new PIXI.Container();
        app.stage.addChild(this.particleStage);
        this.particleStage.width = app.renderer.width;
        this.particleStage.height = app.renderer.height;

        let elapsed = Date.now();

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

    createEmitterByConfig(emitterName, emitterConfig) {
        const emitter = new Emitter(
            this.particleStage,
            emitterConfig
        );
        emitter.emit = false;
        this.emitters[emitterName] = emitter;
        return emitter;
    }

    emit(emitterName) {
        this.emitters[emitterName].emit = true;
    }

    emitCords(emitterName, x, y) {
        this.emitters[emitterName].emit = true;
        this.emitters[emitterName].resetPositionTracking();
        this.emitters[emitterName].updateOwnerPos(x, y);
    }
}