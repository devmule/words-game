import * as cc from 'cc';
import * as types from "./Types";
import {WordsTree} from "./WordsTree";
import {CharController} from "./CharController";
import {HSLController} from "./HSLController";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('GameLayer')
@executeInEditMode
export class GameLayer extends cc.Component {


    //<editor-fold desc="/// editor only">
    private __h: number = 0;
    private __s: number = 0;
    private __l: number = 0;
    private __updatePrefab: boolean = false;

    @property({type: cc.CCBoolean})
    public set updatePrefab(val: boolean) {
        if (val === this.__updatePrefab) return;
        this.__updatePrefab = val;
        if (val) this.initLevel(types.tempLevel);
        else this.clear();
    }

    public get updatePrefab(): boolean {
        return this.__updatePrefab;
    }

    @property({type: cc.CCInteger, slide: true, range: [-180, 180, 1]})
    private get H(): number {
        return this.__h;
    }

    private set H(val: number) {
        this.__h = val;
        this.setHSL(this.H, this.S, this.L);
    }

    @property({type: cc.CCInteger, slide: true, range: [-100, 100, 1]})
    private get S(): number {
        return this.__s;
    }

    private set S(val: number) {
        this.__s = val;
        this.setHSL(this.H, this.S, this.L);
    }

    @property({type: cc.CCInteger, slide: true, range: [-100, 100, 1]})
    private get L(): number {
        return this.__l;
    }

    private set L(val: number) {
        this.__l = val;
        this.setHSL(this.H, this.S, this.L);
    }

    //</editor-fold>

    private charController: CharController | undefined;
    private wordsTree: WordsTree | undefined;
    private level: types.LevelData | undefined;

    start() {

        let wordsTreeNode = this.node.getChildByName('WordsTree') as cc.Node;
        this.wordsTree = wordsTreeNode.getComponent(WordsTree) as WordsTree;

        let charControllerNode = this.node.getChildByName('CharController') as cc.Node;
        this.charController = charControllerNode.getComponent(CharController) as CharController;
        this.charController.node.on(types.Event.WORD_CREATED, this.onWordCreated, this);
    }

    onWordCreated(word: string): void {
        this.wordsTree?.onWordGuess(word);
    }

    initLevel(level: types.LevelData): void {
        this.level = level;
        this.wordsTree?.initLevel(level);
        this.charController?.initLevel(level);

        // применить необязательные переменные
        // задать дефолтные значения
        this.setHSL(...(level?.vis?.hsl || []));
    }

    clear() {
        this.level = undefined;
        this.wordsTree?.clear();
        this.charController?.clear();
    }

    setHSL(h?: number, s?: number, l?: number): void {
        if (!h) h = Math.random() * 360;
        if (!s) s = 0;
        if (!l) l = 0;

        let background = this.node.getChildByName('Background') as cc.Node;
        let backHSL = background?.getComponent(HSLController) as HSLController;
        backHSL?.setHSL(h, s, l);
        this.charController?.setHSL(h, s, l);
        this.wordsTree?.setHSL(h, s, l);
    }

}
