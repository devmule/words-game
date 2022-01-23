import * as cc from 'cc';
import {WGEvent} from "../../Types";
import {LayerBase} from "../LayerBase";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('MenuLayer')
export class MenuLayer extends LayerBase {

    playClicked() {
        this.node.emit(WGEvent.ON_GO_PLAY_CLICK);
    }

    levelsClicked() {
        this.node.emit(WGEvent.ON_GO_LEVEL_CLICK);
    }

    shopClicked() {
        this.node.emit(WGEvent.ON_GO_SHOP_CLICK);
    }

}
