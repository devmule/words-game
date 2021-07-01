import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

@ccclass('Rect')
export class Rect extends cc.Component {

    private textNode: cc.Node | null | undefined;
    private backNode: cc.Node | null | undefined;

    start() {
        this.textNode = this.node.getChildByName("Text");
        this.backNode = this.node.getChildByName("Back");
        this.text = ""; // todo remake text
    }

    setSize(w: number, h: number) {
        const uit = this.node.getComponent(cc.UITransform) as cc.UITransform;

        this.node.setScale(
            w / uit.contentSize.width,
            h / uit.contentSize.height
        );
    }

    set text(text: string) {
        let textComponent = this.textNode?.getComponent(cc.RichText);
        if (textComponent) textComponent.string = text;
        else throw new Error(`Rectangle error: Text component is undefined!`);
    }

    get text(): string {
        let textComponent = this.textNode?.getComponent(cc.RichText);
        return textComponent?.string || "";
    }
}
