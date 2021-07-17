import * as cc from 'cc';
import * as types from "./Types";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('MenuLayer')
export class MenuLayer extends cc.Component {


    start() {
        let buttonPlay = this.node.getChildByName('ButtonPlay') as cc.Node;
        let buttonLevels = this.node.getChildByName('ButtonLevels') as cc.Node;
        let buttonShop = this.node.getChildByName('ButtonShop') as cc.Node;
        if (!buttonPlay.hasEventListener(cc.Node.EventType.TOUCH_START))
            buttonPlay.on(cc.Node.EventType.TOUCH_START, this.playClicked, this);
        if (!buttonLevels.hasEventListener(cc.Node.EventType.TOUCH_START))
            buttonLevels.on(cc.Node.EventType.TOUCH_START, this.levelsClicked, this);
        if (!buttonShop.hasEventListener(cc.Node.EventType.TOUCH_START))
            buttonShop.on(cc.Node.EventType.TOUCH_START, this.shopClicked, this);
    }

    playClicked() {
        this.node.emit(types.Event.ON_GO_PLAY_CLICK);
    }

    levelsClicked() {
        this.node.emit(types.Event.ON_GO_LEVEL_CLICK);
    }

    shopClicked() {
        this.node.emit(types.Event.ON_GO_SHOP_CLICK);
    }

}
