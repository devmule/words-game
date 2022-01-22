import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

import {ColorRGBARaw} from "./Types";

@ccclass('CharButton')
export class CharButton extends cc.Component {

    private _char: string = "";

    private get textComponent(): cc.Label {
        let textNode = this.node.getChildByName("Text") as cc.Node;
        return textNode.getComponent(cc.Label) as cc.Label;
    }

    private get circleSprite(): cc.Sprite {
        let textNode = this.node.getChildByName("Circle") as cc.Node;
        return textNode.getComponent(cc.Sprite) as cc.Sprite;
    }

    private get UITransformComponent(): cc.UITransform {
        return this.node.getComponent(cc.UITransform) as cc.UITransform;
    }


    @property
    private _activated: boolean = false;

    @property({type: cc.CCBoolean})
    public set activated(val: boolean) {
        if (this._activated === val) return;
        this._activated = val;
        this.updateActiveColor();
    }

    public get activated(): boolean {
        return this._activated;
    }


    @property
    private _activeColor: cc.Color = new cc.Color();

    @property({type: cc.Color})
    public set activeColor(color: cc.Color | ColorRGBARaw | undefined) {
        if (color instanceof cc.Color) this._activeColor = color;
        else if (color != null) this._activeColor.set(...color);
        this.updateActiveColor();
    }

    public get activeColor(): cc.Color {
        return this._activeColor;
    }


    @property
    private _inactiveColor: cc.Color = new cc.Color();

    @property({type: cc.Color})
    public set inactiveColor(color: cc.Color | ColorRGBARaw | undefined) {
        if (color instanceof cc.Color) this._inactiveColor = color;
        else if (color != null) this._inactiveColor.set(...color);
        this.updateActiveColor();
    }

    public get inactiveColor(): cc.Color {
        return this._inactiveColor;
    }


    @property({type: cc.Color})
    public set fontColor(color: cc.Color | ColorRGBARaw | undefined) {
        if (color instanceof cc.Color) this.textComponent.color = color;
        else if (color != null) this.textComponent.color.set(...color);
    }

    public get fontColor(): cc.Color {
        return this.textComponent?.color ?? new cc.Color();
    }


    private updateActiveColor() {
        this.circleSprite.color = this._activated ? this._activeColor : this._inactiveColor;
    }


    isCollidedByPoint(v: cc.Vec2): boolean {
        const uit = this.UITransformComponent.contentSize;
        const distance = Math.sqrt(v.x ** 2 + v.y ** 2);
        const radius = (uit.width + uit.height) / 4;

        return distance < radius;

    }

    set char(val: string) {
        this._char = val;
        this.textComponent.string = val.toUpperCase();
    }

    get char(): string {
        return this._char;
    }
}
