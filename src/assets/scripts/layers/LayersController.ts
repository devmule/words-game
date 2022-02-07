import * as cc from "cc";
import * as env from "cc/env";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('LayerDescriptor')
class LayerDescriptor {

    @property
    public name: string = '';

    @property({type: cc.Prefab})
    public layer: cc.Prefab = new cc.Prefab();

}


@ccclass('LayersController')
@executeInEditMode
export class LayersController extends cc.Component {

    @property({visible: false, serializable: true})
    private _currentLayer: string = "";

    @property
    public get currentLayer(): string {
        return this._currentLayer;
    }

    public set currentLayer(val) {
        this._currentLayer = val;
        this.openLayerByName(val, false);
    }

    @property({type: LayerDescriptor})
    private layers: LayerDescriptor[] = [];


    start() {
        this.openLayerByName(this._currentLayer, true);
    }

    public openLayerByName(layerName: string, immediately = false) {

        this._closeAll(immediately);
        let layerDescriptor = this.layers.find((ld) => ld.name == layerName);
        if (!layerDescriptor) return;

        this._openLayer(layerDescriptor, immediately);

    }

    private _closeAll(immediately = false) {

        let layers = [...this.node.children];

        const easing = 'cubicInOut';
        const duration = 1;

        layers.forEach((layer) => {

            if (immediately || env.EDITOR) {
                layer.destroy();
                return;
            }

            const uiOpacity = layer.getComponent(cc.UIOpacity) as cc.UIOpacity;

            cc.tween(layer)
                .to(duration, {position: cc.v3(0, -1000, 0), scale: cc.v3(0.25, 0.25, 0.25)}, {easing})
                .call(() => layer.destroy())
                .start();
            cc.tween(uiOpacity)
                .to(duration, {opacity: 0}, {easing})
                .start();

        });

    }

    private _openLayer(layerDescriptor: LayerDescriptor, immediately = false) {

        let layer = cc.instantiate(layerDescriptor.layer);
        layer.parent = this.node;
        layer.name = layerDescriptor.name;

        const uiOpacity = layer.getComponent(cc.UIOpacity) as cc.UIOpacity;
        const easing = 'cubicInOut';
        const duration = 1;

        if (immediately || env.EDITOR) {
            uiOpacity.opacity = 255;
            layer.setPosition(0, 0, 0);
            layer.setScale(1, 1);
            return;
        }

        layer.setPosition(0, 1000, 0);
        layer.setScale(0.25, 0.25);

        cc.tween(layer)
            .to(duration, {position: cc.v3(0, 0, 0), scale: cc.v3(1, 1, 1)}, {easing})
            .start();
        cc.tween(uiOpacity)
            .to(duration, {opacity: 255}, {easing})
            .start();

    }

}
