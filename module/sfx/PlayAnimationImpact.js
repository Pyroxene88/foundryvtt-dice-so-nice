import { Clock, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { DiceSFX } from '../DiceSFX.js';
import { DiceSFXManager } from './../DiceSFXManager';

export class PlayAnimationImpact extends DiceSFX {
    static id = "PlayAnimationImpact";
    static specialEffectName = "DICESONICE.PlayAnimationImpact";
    static sound = "modules/dice-so-nice/sfx/sounds/hit_glass.mp3";
    static planeImpact = null;
    static duration = 0.1;
     /**@override constructor */
    constructor(box, dicemesh){
        super(box, dicemesh);
        this.enableGC = true;
    }
    /**@override init */
    static async init() {
        game.audio.pending.push(function () {
            foundry.audio.AudioHelper.preloadSound(PlayAnimationImpact.sound);
        }.bind(this));
            
        let data = await this.loadAsset(DiceSFXManager.TextureLoader, "modules/dice-so-nice/sfx/textures/glassimpact_color.webp");
        const geometry = new PlaneGeometry(730, 730);
        const material = new MeshStandardMaterial({
            map: data,
            transparent: true,
            opacity: 2
        });
        PlayAnimationImpact.planeImpact = new Mesh(geometry, material);
    }

    /**@override play */
    async play() {
        this.clock = new Clock();
        this.plane = PlayAnimationImpact.planeImpact.clone();
        this.plane.receiveShadow = this.box.shadows;

        let scale = this.box.dicefactory.baseScale / 100;
        switch (this.dicemesh.shape) {
            case "d2":
                scale *= 1.3;
                break;
            case "d4":
                scale *= 1.1;
                break;
            case "d6":
                break;
            case "d8":
                scale *= 1.1;
                break;
            case "d10":
                break;
            case "d12":
                scale *= 1.2;
                break;
            case "d20":
                scale *= 1.3;
                break;
        }
        this.plane.scale.set(scale, scale, scale);

        this.plane.position.x = this.dicemesh.parent.position.x;
        this.plane.position.y = this.dicemesh.parent.position.y;
        this.plane.rotation.z = Math.random() * Math.PI * 2;
        this.box.scene.add(this.plane);
        foundry.audio.AudioHelper.play({
            src: PlayAnimationImpact.sound,
            volume: this.volume
        }, false);
        this.dicemesh.position.z -= 1;

    }

    destroy() {
        this.box.scene.remove(this.plane);
        this.destroyed = true;
    }
}