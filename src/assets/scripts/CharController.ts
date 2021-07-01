import * as cc from 'cc';
import {CharButton} from "./CharButton";
import {CCInteger} from "cc";

const {ccclass, property} = cc._decorator;

@ccclass('CharController')
export class CharController extends cc.Component {

    private charButtons: cc.Node[] = [];

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

            charBtn.char = char;

            this.charButtons.push(btnNode);
            this.node.addChild(btnNode);
        }
    }

}
