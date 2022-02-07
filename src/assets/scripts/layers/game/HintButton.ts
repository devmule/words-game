import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

const BACKGROUND_NAME = "Background";

@ccclass('HintButton')
export class HintButton extends cc.Button {


    @property({visible: false, serializable: true})
    private _background: cc.SpriteFrame = new cc.SpriteFrame();

    @property
    private get background(): cc.SpriteFrame {
        return this._background;
    }

    private set background(value) {

        this._background = value;

        let backNode = this.node.getChildByName(BACKGROUND_NAME);

        if (!backNode) {
            backNode = new cc.Node(BACKGROUND_NAME);
            backNode.parent = this.node;
            backNode.addComponent(cc.Sprite);
        }

        let backSprite = backNode.getComponent(cc.Sprite) as cc.Sprite;
        backSprite.spriteFrame = value;

        let thisTransform = this.node.getComponent(cc.UITransform) as cc.UITransform;
        let backTransform = backNode.getComponent(cc.UITransform) as cc.UITransform;
        backTransform.width = thisTransform.width;
        backTransform.height = thisTransform.height;

    }

    start() {
        if (super.start) super.start();
        this.background = this._background;
    }

}
