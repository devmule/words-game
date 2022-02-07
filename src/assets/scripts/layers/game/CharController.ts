import * as cc from 'cc';
import {CharButton} from "./CharButton";
import {WGEvent} from "../../WGEvent";
import * as env from "cc/env";

const {ccclass, property} = cc._decorator;

const v1: cc.Vec2 = new cc.Vec2();
const v2: cc.Vec2 = new cc.Vec2();

@ccclass('CharController')
export class CharController extends cc.Component {

    private charButtons: CharButton[] = [];
    private selectedButtons: CharButton[] = [];
    private graphics: cc.Graphics = new cc.Graphics();
    private hintText: cc.Label = new cc.Label();
    private buttonsContainer: cc.Node = new cc.Node();

    @property({type: cc.Prefab})
    private textButtonPrefab: cc.Prefab | undefined;

    @property({type: cc.CCInteger})
    private centerOffset: number = 0;

    start() {

        let lineDrawNode = this.node.getChildByName("LineDraw") as cc.Node;
        this.graphics = lineDrawNode.getComponent(cc.Graphics) as cc.Graphics;
        if (!this.graphics) throw new Error(`graphics is not implemented`);

        let hintText = this.node.getChildByName("HintText") as cc.Node;
        this.hintText = hintText.getComponent(cc.Label) as cc.Label;
        if (!this.graphics) throw new Error(`hintText is not implemented`);

        this.buttonsContainer = this.node.getChildByName("ButtonsContainer") as cc.Node;
        if (!this.graphics) throw new Error(`buttonsContainer is not implemented`);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);

    }

    onDestroy() {

        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);

    }

    initLetters(letters: string) {

        this.clear();

        const pref = this.textButtonPrefab as unknown as cc.Prefab;

        for (let i = 0; i < letters.length; i++) {

            let btnNode = cc.instantiate(pref) as cc.Node;

            let charBtn = btnNode.getComponent(CharButton) as CharButton;
            charBtn.activated = false;
            charBtn.char = letters[i];

            this.charButtons.push(charBtn);
            this.buttonsContainer.addChild(btnNode);
        }

        this.shuffleButtons();

    }

    touchEnd(e: cc.EventTouch) {

        let word = '';
        for (let i = 0; i < this.selectedButtons.length; i++) {
            let btn = this.selectedButtons[i];
            btn.activated = false;
            word += btn.char;
        }
        if (word.length > 0) {
            this.node.emit(WGEvent.WORD_CREATED, word);
        }
        this.selectedButtons.length = 0;

        this.graphics.clear();
        this.updateHintText();

    }

    touchMove(e: cc.EventTouch) {

        let cursor = v1;
        let local = v2;

        cursor = (e.touch as unknown as cc.EventTouch).getUILocation(cursor);

        for (let i = 0; i < this.charButtons.length; i++) {
            let btn = this.charButtons[i];
            if (!btn.activated) {
                local.set(-cursor.x, -cursor.y);
                local = local.transformMat4(btn.node.worldMatrix);
                local.set(-local.x, -local.y);
                if (btn.isCollidedByPoint(local)) {
                    btn.activated = true;
                    this.selectedButtons.push(btn);
                    this.updateHintText();
                }
            }
        }


        local.set(-cursor.x, -cursor.y);
        local = local.transformMat4(this.node.worldMatrix);
        local.set(-local.x, -local.y);

        const points = [...this.selectedButtons.map(btn => btn.node.position), local];

        this.graphics.clear();

        if (points.length > 0) {
            this.graphics.moveTo(points[0].x, points[0].y);

            for (let i = 0; i < points.length - 1; i++) {
                let p0 = (i > 0) ? points[i - 1] : points[0];
                let p1 = points[i];
                let p2 = points[i + 1];
                let p3 = (i != points.length - 2) ? points[i + 2] : p2;

                let cp1x = p1.x + (p2.x - p0.x) / 6;
                let cp1y = p1.y + (p2.y - p0.y) / 6;

                let cp2x = p2.x - (p3.x - p1.x) / 6;
                let cp2y = p2.y - (p3.y - p1.y) / 6;

                this.graphics.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }
        }

        this.graphics.stroke();
    }

    updateHintText() {
        let word = '';
        for (let i = 0; i < this.selectedButtons.length; i++)
            word += this.selectedButtons[i].char;
        this.hintText.string = word;
    }

    shuffleButtons() {
        for (let i = 0; i < this.charButtons.length; i++) {
            let j = i + Math.floor((this.charButtons.length - i) * Math.random());
            [this.charButtons[i], this.charButtons[j]] = [this.charButtons[j], this.charButtons[i]];
        }

        const easing = 'cubicInOut';
        const uit = (this.node.getComponent(cc.UITransform) as cc.UITransform).contentSize;
        const sector = Math.PI * 2 / this.charButtons.length;

        for (let i = 0; i < this.charButtons.length; i++) {
            let btn = this.charButtons[i] as CharButton;
            let to = cc.v3(
                Math.cos(i * sector) * (uit.width / 2 + this.centerOffset),
                Math.sin(i * sector) * (uit.height / 2 + this.centerOffset),
            );

            if (env.EDITOR) {
                btn.node.position = to;
            } else {
                cc.Tween.stopAllByTarget(btn);
                cc.tween(btn.node)
                    .delay(0.3 * Math.random())
                    .to(0.3 + 0.3 * Math.random(), {position: to}, {easing})
                    .start();
            }
        }
    }

    clear() {

        // удалить все кнопки и обнулить параметры
        let copy = this.buttonsContainer.children.map(c => c);
        for (let i = 0; i < copy.length; i++) {
            let child = copy[i];
            child.removeFromParent();
        }

        this.charButtons.length = 0;
        this.selectedButtons.length = 0;
        this.hintText.string = '';

    }

}
