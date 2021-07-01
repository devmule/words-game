import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

@ccclass('CharButton')
export class CharButton extends cc.Component {

    start() {
    }

    get text(): cc.RichText {
        let textNode = this.node.getChildByName("Text") as cc.Node;
        return textNode.getComponent(cc.RichText) as cc.RichText;
    }

    set char(val: string) {
        this.text.string = val;
    }

    get char(): string {
        return this.text.string;
    }
}
