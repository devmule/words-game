import * as cc from 'cc';
import {WGEvent} from "../../Types";
import {Root} from "../../Root";
import {getRoot} from "../../Utils";
import {LayerBase} from "../LayerBase";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('MenuLayer')
export class MenuLayer extends LayerBase {


    private root: Root | undefined;

    private buttonPlay: cc.Node | undefined;
    private buttonLevels: cc.Node | undefined;
    private buttonShop: cc.Node | undefined;


    start() {

        this.root = getRoot();

        this.buttonPlay = this.layerRoot.getChildByName('ButtonPlay') as cc.Node;
        this.buttonLevels = this.layerRoot.getChildByName('ButtonLevels') as cc.Node;
        this.buttonShop = this.layerRoot.getChildByName('ButtonShop') as cc.Node;

        if (!this.buttonPlay.hasEventListener(cc.Node.EventType.TOUCH_START)) {
            this.buttonPlay.on(cc.Node.EventType.TOUCH_START, this.playClicked, this);
        }
        if (!this.buttonLevels.hasEventListener(cc.Node.EventType.TOUCH_START)) {
            this.buttonLevels.on(cc.Node.EventType.TOUCH_START, this.levelsClicked, this);
        }
        if (!this.buttonShop.hasEventListener(cc.Node.EventType.TOUCH_START)) {
            this.buttonShop.on(cc.Node.EventType.TOUCH_START, this.shopClicked, this);
        }

    }

    update(dt: number) {
    }

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
