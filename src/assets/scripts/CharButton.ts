import * as cc from 'cc';

const {ccclass, property} = cc._decorator;
import * as types from "./Types";

@ccclass('CharButton')
export class CharButton extends cc.Component {

    private _textComponent: cc.RichText | undefined;
    public activated: boolean = false; // todo as getter/setter for effects

    get textComponent(): cc.RichText {
        if (this._textComponent) return this._textComponent;
        let textNode = this.node.getChildByName("Text") as cc.Node;
        this._textComponent = textNode.getComponent(cc.RichText) as cc.RichText;
        return this._textComponent;
    }

    set char(val: string) {
        this.textComponent.string = val;
    }

    get char(): string {
        return this.textComponent.string;
    }
}
