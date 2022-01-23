import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

@ccclass('CharRect')
export class CharRect extends cc.Component {

    private _text: string = "";
    private _isOpened: boolean = false;
    private _shaker: cc.Tween<cc.Node> | null = null;

    private get textNode(): cc.Node {
        return this.node.getChildByName("Text") as cc.Node;
    }

    private get backSprite(): cc.Sprite {
        let node = this.node.getChildByName("Back") as cc.Node;
        return node.getComponent(cc.Sprite) as cc.Sprite;
    }

    private get textComponent(): cc.Label {
        return this.textNode.getComponent(cc.Label) as cc.Label;
    }

    private get textOutlineComponent(): cc.LabelOutline {
        let textNode = this.node.getChildByName("Text") as cc.Node;
        return textNode.getComponent(cc.LabelOutline) as cc.LabelOutline;
    }


    @property({type: cc.Color})
    public set backColor(color: cc.Color | string | undefined) {
        if (color instanceof cc.Color) this.backSprite.color = color;
        else if (color != null) this.backSprite.color.fromHEX(color);
    }

    public get backColor(): cc.Color {
        return this.backSprite?.color ?? new cc.Color();
    }


    @property({type: cc.Color})
    public set fontColor(color: cc.Color | undefined) {
        if (color instanceof cc.Color) this.textOutlineComponent.color = color;
        else if (color != null) this.textOutlineComponent.color.fromHEX(color);
    }

    public get fontColor(): cc.Color {
        return this.textOutlineComponent?.color ?? new cc.Color();
    }


    public setSize(w: number, h: number) {
        const uit = this.node.getComponent(cc.UITransform) as cc.UITransform;

        this.node.setScale(
            w / uit.contentSize.width,
            h / uit.contentSize.height
        );
    }

    public get text(): string {
        return this._text;
    }

    public set text(val: string) {
        this._text = val;
        this.textComponent.string = val.toUpperCase();
        if (this._isOpened) this.textNode.setScale(1, 1, 1);
        else this.textNode.setScale(0, 0, 0);
    }

    public get isOpened() {
        return this._isOpened;
    }

    public open(delay: number = 0) {
        if (this._isOpened) return;
        this._isOpened = true;

        const
            s0 = cc.v3(0, 0, 0),
            s1 = cc.v3(1, 1, 1),
            easing = 'backInOut',
            time = 0.3,
            scale1 = cc.v3(1, 1, 1),
            scale2 = cc.v3(1.2, 1.2, 1.2);

        this.textNode.setScale(s0);
        cc.tween(this.textNode)
            .delay(delay)
            .to(time, {scale: s1}, {easing})
            .start();

        cc.Tween.stopAllByTarget(this.backSprite.node);

        cc.tween(this.backSprite.node)
            .delay(delay)
            .to(time / 2, {scale: scale2})
            .to(time / 2, {scale: scale1})
            .start();
    }

    public close(delay: number = 0) {
        if (!this._isOpened) return;
        this._isOpened = false;

        const s0 = cc.v3(0, 0, 0);
        const easing = 'backInOut';
        cc.tween(this.textNode)
            .delay(delay)
            .to(.5, {scale: s0}, {easing})
            .start();
    }

    set shaking(val: boolean) {
        if (val == this.shaking) return;

        if (val) {

            let a = 20 + Math.random() * 10,
                rot1 = -a / 2,
                rot2 = a / 2,
                min = 0.3,
                max = 0.5,
                t = Math.random() * (max - min) + min;

            if (Math.random() > 0.5) [rot1, rot2] = [rot2, rot1];

            this._shaker = cc.tween(this.node)
                .to(t, {angle: rot2})
                .to(t, {angle: rot1})
                .union()
                .repeatForever()
                .start();


        } else {

            if (!this._shaker) return;
            this._shaker.stop();
            this._shaker = null;
            let min = 0.3,
                max = 0.5,
                t = Math.random() * (max - min) + min;
            cc.tween(this.node)
                .to(t, {angle: 0})
                .start();

        }

    }

    get shaking(): boolean {
        return !!this._shaker;
    }

}
