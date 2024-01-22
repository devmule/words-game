import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

@ccclass('CharButton')
export class CharButton extends cc.Component {

    private _char: string = "";

    private get textComponent(): cc.Label {
        return this.node.getComponentInChildren(cc.Label)!;
    }

    private get textOutlineComponent(): cc.LabelOutline {
        return this.node.getComponentInChildren(cc.LabelOutline)!;
    }

    private get backgroundSpriteComponent(): cc.Sprite {
        return this.node.getComponentInChildren(cc.Sprite)!;
    }

    private get UITransformComponent(): cc.UITransform {
        return this.node.getComponentInChildren(cc.UITransform)!;
    }


    @property
    private _activated: boolean = false;

    @property({type: cc.CCBoolean})
    public set activated(val: boolean) {
        if (this._activated === val) return;
        this._activated = val;
        this.updateActiveColor();
        this.doShake();
    }

    public get activated(): boolean {
        return this._activated;
    }


    @property
    private _activeColor: cc.Color = new cc.Color();

    @property({type: cc.Color})
    public set activeColor(color: cc.Color | string | undefined) {
        if (color instanceof cc.Color) this._activeColor = color;
        else if (color != null) this._activeColor.fromHEX(color);
        this.updateActiveColor();
    }

    public get activeColor(): cc.Color {
        return this._activeColor;
    }


    @property
    private _inactiveColor: cc.Color = new cc.Color();

    @property({type: cc.Color})
    public set inactiveColor(color: cc.Color | string | undefined) {
        if (color instanceof cc.Color) this._inactiveColor = color;
        else if (color != null) this._inactiveColor.fromHEX(color);
        this.updateActiveColor();
    }

    public get inactiveColor(): cc.Color {
        return this._inactiveColor;
    }


    @property({type: cc.Color})
    public set fontColor(color: cc.Color | string | undefined) {
        if (color instanceof cc.Color) this.textOutlineComponent.color = color;
        else if (color != null) this.textOutlineComponent.color.fromHEX(color);
    }

    public get fontColor(): cc.Color {
        return this.textOutlineComponent?.color ?? new cc.Color();
    }


    private updateActiveColor() {
        this.backgroundSpriteComponent.color = this._activated ? this._activeColor : this._inactiveColor;
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

    public doShake(): void {

        cc.Tween.stopAllByTarget(this.node);
        let easing: cc.TweenEasing = "linear",
            scale1 = cc.v3(1, 1, 1),
            scale2 = cc.v3(1.2, 1.2, 1.2),
            time = 0.2;

        cc.tween(this.node)
            .to(time / 2, {scale: scale2}, {easing})
            .to(time / 2, {scale: scale1}, {easing})
            .start();

    }
}
