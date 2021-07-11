import * as cc from 'cc';
import {CharButton} from "./CharButton";
import {CCInteger} from "cc";
import * as types from "./Types";

const {ccclass, property} = cc._decorator;

@ccclass('CharController')
export class CharController extends cc.Component {


    static v1: cc.Vec2 = new cc.Vec2();
    static v2: cc.Vec2 = new cc.Vec2();

    private charButtons: CharButton[] = [];
    private selectedButtons: CharButton[] = [];
    private graphics: cc.Graphics | undefined;

    @property({type: cc.Prefab})
    public textButtonPrefab: cc.Prefab | undefined;

    @property({type: CCInteger})
    public centerOffset: number = 0;

    initLevel(letters: string) {

        const pref = this.textButtonPrefab as unknown as cc.Prefab;
        const uit = (this.node.getComponent(cc.UITransform) as cc.UITransform).contentSize;
        const sector = Math.PI * 2 / letters.length;

        for (let i = 0; i < letters.length; i++) {

            const char = letters[i]

            let btnNode = cc.instantiate(pref) as unknown as cc.Node;
            btnNode.setPosition(
                Math.cos(i * sector) * (uit.width / 2 + this.centerOffset),
                Math.sin(i * sector) * (uit.height / 2 + this.centerOffset)
            );

            let charBtn = btnNode.getComponent(CharButton) as CharButton;
            charBtn.char = char;

            this.charButtons.push(charBtn);
            this.node.addChild(btnNode);
        }
    }

    onButtonGestured(button: CharButton): void {
        if (!button.activated) {
            button.activated = true;
            this.selectedButtons.push(button);
        }
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);

        let lineDrawNode = this.node.getChildByName("LineDraw") as cc.Node;
        this.graphics = lineDrawNode.getComponent(cc.Graphics) as cc.Graphics;
    }

    touchEnd(e: cc.EventTouch) {

        this.graphics?.clear();

        let word = '';
        for (let i = 0; i < this.selectedButtons.length; i++) {
            let btn = this.selectedButtons[i];
            btn.activated = false;
            word += btn.char;
        }
        if (word.length > 0) {
            this.node.emit(types.Event.WORD_CREATED, word);
        }
        this.selectedButtons.length = 0;

    }

    touchMove(e: cc.EventTouch) {

        let cursor = CharController.v1;
        let local = CharController.v2;

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
                }
            }
        }

        if (this.graphics) {

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

                    let cp1x = p1.x + (p2.x - p0.x) / 3;
                    let cp1y = p1.y + (p2.y - p0.y) / 3;

                    let cp2x = p2.x - (p3.x - p1.x) / 3;
                    let cp2y = p2.y - (p3.y - p1.y) / 3;

                    this.graphics.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                }
            }

            this.graphics.stroke();
        }
    }

}
