import * as cc from 'cc';

const {ccclass, property} = cc._decorator;
import * as types from "./Types";

@ccclass('CharButton')
export class CharButton extends cc.Component {

    private _textComponent: cc.RichText | undefined;
    private _spriteComponent: cc.Sprite | undefined;
    private _uitComponent: cc.UITransform | undefined;
    public _activated: boolean = false;

    @property({type: cc.Color})
    public defaultColor: cc.Color = new cc.Color();

    @property({type: cc.Color})
    public activeColor: cc.Color = new cc.Color();

    isCollidedByPoint(v: cc.Vec2): boolean {
        const uit = this.uit.contentSize;
        const distance = Math.sqrt(v.x ** 2 + v.y ** 2);
        const radius = (uit.width + uit.height) / 4;

        return distance < radius;

    }

    get textComponent(): cc.RichText {
        if (this._textComponent) return this._textComponent;
        let textNode = this.node.getChildByName("Text") as cc.Node;
        this._textComponent = textNode.getComponent(cc.RichText) as cc.RichText;
        return this._textComponent;
    }

    get spriteComponent(): cc.Sprite {
        if (this._spriteComponent) return this._spriteComponent;
        let textNode = this.node.getChildByName("Circle") as cc.Node;
        this._spriteComponent = textNode.getComponent(cc.Sprite) as cc.Sprite;
        return this._spriteComponent;
    }

    get uit(): cc.UITransform {
        if (this._uitComponent) return this._uitComponent;
        this._uitComponent = this.node.getComponent(cc.UITransform) as cc.UITransform;
        return this._uitComponent;
    }

    set char(val: string) {
        this.textComponent.string = val.toUpperCase();
    }

    get char(): string {
        return this.textComponent.string;
    }

    set activated(val: boolean) {
        if (this._activated !== val) {
            this._activated = val;
            this.spriteComponent.color = val ? this.activeColor : this.defaultColor;
        }
    }

    get activated(): boolean {
        return this._activated;
    }
}
