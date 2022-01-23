import * as cc from "cc";
import * as env from "cc/env";

const {ccclass, property, executeInEditMode} = cc._decorator;

const SCREEN_NAME = "screen";

@ccclass('LayersController')
@executeInEditMode
export class LayersController extends cc.Component {

    // screens
    closeTop(immediately: boolean = false): cc.Node | undefined {
        let screenNode = this.node.children[this.node.children.length - 1] as cc.Node | undefined;
        if (screenNode) this.closeLayer(screenNode, immediately);
        return screenNode;
    }

    addLayer(content: cc.Node, immediately: boolean = false) {

        const screenNode = new cc.Node(SCREEN_NAME);
        screenNode.addChild(content);

        screenNode.addComponent(cc.UIOpacity);

        this.openLayer(screenNode, immediately);
    }

    closeAll(immediately: boolean = false) {
        let children = this.node.children.map(c => c);
        for (let i = 0; i < children.length; i++) {
            let screenNode = children[i];
            if (screenNode.name != SCREEN_NAME) continue;
            this.closeLayer(screenNode, immediately);
        }
    }

    private closeLayer(screenNode: cc.Node, immediately: boolean) {

        const opacity = screenNode.getComponent(cc.UIOpacity) as cc.UIOpacity;

        if (immediately || env.EDITOR) {
            screenNode.removeFromParent();

        } else {
            const easing = 'cubicInOut';
            const d = 1;

            cc.tween(screenNode)
                .to(d, {position: cc.v3(0, -1000, 0), scale: cc.v3(0.25, 0.25, 0.25)}, {easing})
                .call(() => screenNode.removeFromParent())
                .start();
            cc.tween(opacity)
                .to(d, {opacity: 0}, {easing})
                .start();
        }
    }

    private openLayer(screenNode: cc.Node, immediately: boolean) {

        const easing = 'cubicInOut';
        const d = 1;
        const opacity = screenNode.getComponent(cc.UIOpacity) as cc.UIOpacity;

        this.node.addChild(screenNode);

        if (!immediately && !env.EDITOR) {
            screenNode.setPosition(0, 1000, 0);
            screenNode.setScale(0.25, 0.25, 0.25);
            opacity.opacity = 0;

            cc.tween(screenNode)
                .to(d, {position: cc.v3(0, 0, 0), scale: cc.v3(1, 1, 1)}, {easing})
                .call(() => null)
                .start();
            cc.tween(opacity)
                .to(d, {opacity: 255}, {easing})
                .start();
        }


    }
}
