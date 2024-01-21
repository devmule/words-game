import * as cc from 'cc';
import {findComponent} from "../Core/Utils";
import {LayersController} from "./LayersController";

const {ccclass, property} = cc._decorator;

@ccclass('Layer')
export class Layer extends cc.Component {

    public callOpenLayer(e: cc.Event, screenName: string) {
        let layersController = findComponent(LayersController) as LayersController;
        layersController.openLayerByName(screenName);
    }

    start() {
    }
}
