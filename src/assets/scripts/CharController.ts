import * as cc from 'cc';
import {CharButton} from "./CharButton";
import * as types from "./Types";
import * as env from "cc/env";
import {ColorRGBARaw} from "./Types";

const {ccclass, property} = cc._decorator;

const v1: cc.Vec2 = new cc.Vec2();
const v2: cc.Vec2 = new cc.Vec2();

@ccclass('CharController')
export class CharController extends cc.Component {

    private charButtons: CharButton[] = [];
    private selectedButtons: CharButton[] = [];
    private _graphics: cc.Graphics | undefined;
    private _hintText: cc.RichText | undefined;
    private _hintTextColor: cc.Color = new cc.Color();

    private get graphics(): cc.Graphics {
        if (this._graphics) return this._graphics;
        let lineDrawNode = this.node.getChildByName("LineDraw") as cc.Node;
        this._graphics = lineDrawNode.getComponent(cc.Graphics) as cc.Graphics;
        return this._graphics;
    }

    private get hintText(): cc.RichText {
        if (this._hintText) return this._hintText;
        let hintText = this.node.getChildByName("HintText") as cc.Node;
        this._hintText = hintText.getComponent(cc.RichText) as cc.RichText;
        return this._hintText;
    }

    private setHintTextColor(color: ColorRGBARaw) {
    }

    @property({type: cc.Prefab})
    public textButtonPrefab: cc.Prefab | undefined;

    @property({type: cc.CCInteger})
    public centerOffset: number = 0;

    initLevel(levelData: types.LevelData) {

        if (!this.node.hasEventListener(cc.Node.EventType.TOUCH_CANCEL))
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        if (!this.node.hasEventListener(cc.Node.EventType.TOUCH_END))
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        if (!this.node.hasEventListener(cc.Node.EventType.TOUCH_MOVE))
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);

        let btnHintShuffle = this.node.getChildByName('HintShuffle') as cc.Node;
        let btnHintOpenRandom = this.node.getChildByName('HintOpenRandom') as cc.Node;
        let btnHintOpenInTree = this.node.getChildByName('HintOpenInTree') as cc.Node;
        let btnHintOpenWord = this.node.getChildByName('HintOpenWord') as cc.Node;
        if (!btnHintShuffle.hasEventListener(cc.Node.EventType.TOUCH_START))
            btnHintShuffle.on(cc.Node.EventType.TOUCH_START, () => this.node.emit(types.Event.HINT_SHUFFLE), this);
        if (!btnHintOpenRandom.hasEventListener(cc.Node.EventType.TOUCH_START))
            btnHintOpenRandom.on(cc.Node.EventType.TOUCH_START, () => this.node.emit(types.Event.HINT_OP_CHAR_RAND), this);
        if (!btnHintOpenInTree.hasEventListener(cc.Node.EventType.TOUCH_START))
            btnHintOpenInTree.on(cc.Node.EventType.TOUCH_START, (e: cc.Event) => {
                e.propagationStopped = e.propagationImmediateStopped = true;
                this.node.emit(types.Event.HINT_OP_IN_TREE)
            }, this);
        if (!btnHintOpenWord.hasEventListener(cc.Node.EventType.TOUCH_START))
            btnHintOpenWord.on(cc.Node.EventType.TOUCH_START, () => this.node.emit(types.Event.HINT_OPEN_WORD), this);


        this.clear();
        let letters = levelData.letters;

        const pref = this.textButtonPrefab as unknown as cc.Prefab;

        for (let i = 0; i < letters.length; i++) {

            let btnNode = cc.instantiate(pref) as unknown as cc.Node;

            let charBtn = btnNode.getComponent(CharButton) as CharButton;
            charBtn.char = letters[i];
            charBtn.inactiveColor = levelData.visualData?.primaryColor;
            charBtn.activeColor = levelData.visualData?.secondaryColor;
            charBtn.fontColor = levelData.visualData?.fontColor;

            this.charButtons.push(charBtn);
            this.node.addChild(btnNode);
        }

        this.shuffleButtons();
    }

    onButtonGestured(button: CharButton): void {
        if (!button.activated) {
            button.activated = true;
            this.selectedButtons.push(button);
        }
    }

    touchEnd(e: cc.EventTouch) {

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

        for (let i = 0; i < this.node.children.length; i++) {
            let child = this.node.children[i] as cc.Node;
            if (child.name === 'CharButton') {
                child.removeFromParent();
                i--;
            }
        }

        this.charButtons.length = 0;
        this.selectedButtons.length = 0;
        this.hintText.string = '';
    }

}
