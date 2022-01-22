import * as cc from 'cc';
import {ColorRGBARaw} from "./Types";

const {ccclass, property} = cc._decorator;

@ccclass('CharRect')
export class CharRect extends cc.Component {

    private _text: string = "";
    private _isOpened: boolean = false;

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


    @property({type: cc.Color})
    public set backColor(color: cc.Color | ColorRGBARaw | undefined) {
        if (color instanceof cc.Color) this.backSprite.color = color;
        else if (color != null) this.backSprite.color.set(...color);
    }

    public get backColor(): cc.Color {
        return this.backSprite?.color ?? new cc.Color();
    }


    @property({type: cc.Color})
    public set fontColor(color: cc.Color | ColorRGBARaw | undefined) {
        if (color instanceof cc.Color) this.textComponent.color = color;
        else if (color != null) this.textComponent.color.set(...color);
    }

    public get fontColor(): cc.Color {
        return this.textComponent?.color ?? new cc.Color();
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

        const s0 = cc.v3(0, 0, 0);
        const s1 = cc.v3(1, 1, 1);
        const easing = 'backInOut';
        this.textNode.setScale(s0);
        cc.tween(this.textNode)
            .delay(delay)
            .to(.5, {scale: s1}, {easing})
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

}
