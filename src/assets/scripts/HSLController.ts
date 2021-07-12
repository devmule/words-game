import * as cc from 'cc';

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('HSLController')
@executeInEditMode
export class HSLController extends cc.Component {

    public get material(): cc.Material {
        return (this.node.getComponent(cc.Sprite) as cc.Sprite).material as cc.Material;
    }

    setHSL(h: number, s: number, l: number) {
        this.material?.setProperty("HUE_shift", (h) / 360, 0);
        this.material?.setProperty("SATURATION_factor", (s + 100) / 100, 0);
        this.material?.setProperty("LIGHTNESS_factor", (l + 100) / 100, 0);
    }
}
