import * as cc from "cc";
import * as types from "./Types";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('ScreenController')
@executeInEditMode
export class ScreenController extends cc.Component {

    // screens
    closeTop(immediately: boolean = false): cc.Node | undefined {
        let screenNode = this.node.children[this.node.children.length - 1] as cc.Node | undefined;
        if (screenNode) this.closeScreen(screenNode, immediately);
        return screenNode;
    }

    addScreen(content: cc.Node, immediately: boolean = false) {

        const screenNode = new cc.Node('screen');
        screenNode.addChild(content);

        screenNode.addComponent(cc.UIOpacity);

        this.openScreen(screenNode, immediately);
    }

    closeAll(immediately: boolean = false) {
        let children = this.node.children.map(c => c);
        for (let i = 0; i < children.length; i++)
            this.closeScreen(children[i], immediately);
    }

    closeScreen(screenNode: cc.Node, immediately: boolean) {

        const opacity = screenNode.getComponent(cc.UIOpacity) as cc.UIOpacity;

        if (immediately) {
            screenNode.removeFromParent();

        } else {
            cc.tween(screenNode)
                .to(1, {position: cc.v3(0, 1000, 0), scale: cc.v3(2, 2, 2)})
                .call(() => screenNode.removeFromParent())
                .start();
            cc.tween(opacity)
                .to(1, {opacity: 0})
                .start();
        }
    }

    openScreen(screenNode: cc.Node, immediately: boolean) {

        const opacity = screenNode.getComponent(cc.UIOpacity) as cc.UIOpacity;

        this.node.addChild(screenNode);

        if (!immediately) {
            cc.tween(screenNode)
                .to(1, {position: cc.v3(0, 0, 0), scale: cc.v3(1, 1, 1)})
                .start();
            cc.tween(opacity)
                .to(1, {opacity: 255})
                .start();
        }


    }
}
