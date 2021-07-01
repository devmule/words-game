import * as cc from 'cc';
import {CharButton} from "./CharButton";
import {CCInteger} from "cc";
import * as types from "./Types";

const {ccclass, property} = cc._decorator;

@ccclass('CharController')
export class CharController extends cc.Component {


    static tempVec2: cc.Vec2 = new cc.Vec2();

    private charButtons: cc.Node[] = [];
    private selectedButtons: CharButton[] = [];

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

            const btnNode = cc.instantiate(this.textButtonPrefab) as unknown as cc.Node;
            btnNode.setPosition(
                Math.cos(i * sector) * (uit.width / 2 + this.centerOffset),
                Math.sin(i * sector) * (uit.height / 2 + this.centerOffset)
            );

            const charBtn = btnNode.getComponent(CharButton) as CharButton;
            btnNode.on(cc.Node.EventType.TOUCH_MOVE, () => this.onButtonGestured(charBtn));

            charBtn.char = char;

            this.charButtons.push(btnNode);
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

    }

    touchMove(e: cc.EventTouch) {

        let vec = CharController.tempVec2;
        vec = (e.touch as unknown as cc.EventTouch).getUILocation(vec);
        vec.y = -vec.y;
        vec.x = -vec.x;
        vec = vec.transformMat4(this.node.worldMatrix);
        console.log(vec);
    }

}
