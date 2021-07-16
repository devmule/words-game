import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

@ccclass('CharRect')
export class CharRect extends cc.Component {

    private _textNode: cc.Node | undefined;
    private _backNode: cc.Node | undefined;
    public text: string = '';

    private get textNode(): cc.Node {
        if (this._textNode) return this._textNode;
        this._textNode = this.node.getChildByName("Text") as cc.Node;
        return this._textNode;
    }

    private get backNode(): cc.Node {
        if (this._backNode) return this._backNode;
        this._backNode = this.node.getChildByName("Back") as cc.Node;
        return this._backNode;
    }

    setSize(w: number, h: number) {
        const uit = this.node.getComponent(cc.UITransform) as cc.UITransform;

        this.node.setScale(
            w / uit.contentSize.width,
            h / uit.contentSize.height
        );
    }

    set opened(val: boolean) {
        let textComponent = this.textNode.getComponent(cc.RichText);
        if (textComponent) textComponent.string = val ? this.text.toUpperCase() : '';
        else throw new Error(`Rectangle error: Text component is undefined!`);
    }

    get opened() {
        let textComponent = this.textNode.getComponent(cc.RichText);
        return textComponent?.string !== '';
    }
}
