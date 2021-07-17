import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

@ccclass('CharRect')
export class CharRect extends cc.Component {

    private _textNode: cc.Node | undefined;
    private _backNode: cc.Node | undefined;
    private _isOpened = false;

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

    get text(): string {
        return (this.textNode.getComponent(cc.RichText) as cc.RichText).string;
    }

    set text(val: string) {
        (this.textNode.getComponent(cc.RichText) as cc.RichText).string = val.toUpperCase();
        if (this._isOpened) this.textNode.setScale(1, 1, 1);
        else this.textNode.setScale(0, 0, 0);
    }

    get isOpened() {
        return this._isOpened;
    }

    open(delay: number = 0) {
        if (this._isOpened) return;
        this._isOpened = true;

        const s0 = cc.v3(0, 0, 0);
        const s1 = cc.v3(1, 1, 1);
        const easing = 'backInOut';
        this.textNode.setScale(s0);
        cc.tween(this.textNode)
            .delay(delay)
            .to(.5, {scale: s1}, {easing})
            .start();
    }

    close(delay: number = 0) {
        if (!this._isOpened) return;
        this._isOpened = false;

        const s0 = cc.v3(0, 0, 0);
        const easing = 'backInOut';
        cc.tween(this.textNode)
            .delay(delay)
            .to(.5, {scale: s0}, {easing})
            .start();
    }
}
