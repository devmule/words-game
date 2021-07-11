import * as cc from 'cc';
import * as types from "./Types";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('HSLController')
@executeInEditMode
export class HSLController extends cc.Component {

    public get material(): cc.Material {
        return (this.node.getComponent(cc.Sprite) as cc.Sprite).material as cc.Material;
    }

    @property({type: cc.CCInteger, slide: true, range: [0, 360, 1]})
    public H: number = 360 / 2;

    @property({type: cc.CCInteger, slide: true, range: [-100, 100, 1]})
    public S: number = 0;

    @property({type: cc.CCInteger, slide: true, range: [-100, 100, 1]})
    public L: number = 0;

    protected update(dt: number) {
        this.updateShaderValues();
    }

    public updateShaderValues() {
        this.material?.setProperty("HUE_shift", this.H / 360, 0);
        this.material?.setProperty("SATURATION_factor", (this.S + 100) / 100, 0);
        this.material?.setProperty("LIGHTNESS_factor", (this.L + 100) / 100, 0);
    }
}
