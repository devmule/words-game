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
        if (val) this.initLevel(types.tempLevels[0]);
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

    private level: types.LevelData | undefined;
    private isHintOpenInTreeActive = false;

    private isWon = false;

    private _charController: CharController | undefined;
    private _wordsTree: WordsTree | undefined;

    private get charController(): CharController {
        if (this._charController) return this._charController;
        let charControllerNode = this.node.getChildByName('CharController') as cc.Node;
        this._charController = charControllerNode.getComponent(CharController) as CharController;
        return this._charController;
    }

    private get wordsTree(): WordsTree {
        if (this._wordsTree) return this._wordsTree;
        let wordsTreeNode = this.node.getChildByName('WordsTree') as cc.Node;
        this._wordsTree = wordsTreeNode.getComponent(WordsTree) as WordsTree;
        return this._wordsTree;
    }

    onWordCreated(word: string): void {
        if (this.isWon) return;

        let isWordOpened = this.wordsTree.openWord(word);
        if (isWordOpened) {
            // todo effects
            if (this.wordsTree.isWin) this.onWin();
        }
    }

    onHintShuffle() {
        if (this.isWon) return;

        this.charController.shuffleButtons();
    }

    onHintOpenCharRand() {
        if (this.isWon) return;

        this.wordsTree.openCharRandomly();
        if (this.wordsTree.isWin) this.onWin();
    }

    onHintOpenInTree() {
        if (this.isWon) return;

        if (!this.isHintOpenInTreeActive) {
            this.isHintOpenInTreeActive = true;
        }
    }

    onHintOpenWord() {
        if (this.isWon) return;

        this.wordsTree.openWordRandomly();
        if (this.wordsTree.isWin) this.onWin();
    }

    onWin() {
        this.isWon = true;

        cc.tween(this.node)
            .delay(1)
            .call(() => this.wordsTree.destroyTree())
            .delay(3)
            .call(() => this.node.emit(types.Event.ON_LEVEL_WIN))
            .start();
    }

    onTreeRectClicked(x: number, y: number) {
        if (this.isWon) return;

        if (this.isHintOpenInTreeActive) {
            let wasOpened = this.wordsTree.openRect(x, y);
            if (wasOpened) {
                this.isHintOpenInTreeActive = false;
                if (this.wordsTree.isWin) this.onWin();
            }
        }
    }

    onLayerClicked(e: cc.Event) {
        if (this.isWon) return;

        if (this.isHintOpenInTreeActive) {

            let isCharClicked = false;
            for (let target = e.target as cc.Node | null; target != null; target = target.parent)
                if (target.parent === this.wordsTree.node) {
                    isCharClicked = true;
                    break;
                }

            if (!isCharClicked) {
                this.isHintOpenInTreeActive = false;
            }
        }
    }

    initLevel(level: types.LevelData): void {

        if (!this.node.hasEventListener(cc.Node.EventType.TOUCH_START))
            this.node.on(cc.Node.EventType.TOUCH_START, this.onLayerClicked, this);
        if (!this.charController.node.hasEventListener(types.Event.WORD_CREATED))
            this.charController.node.on(types.Event.WORD_CREATED, this.onWordCreated, this);
        if (!this.charController.node.hasEventListener(types.Event.HINT_SHUFFLE))
            this.charController.node.on(types.Event.HINT_SHUFFLE, this.onHintShuffle, this);
        if (!this.charController.node.hasEventListener(types.Event.HINT_OP_CHAR_RAND))
            this.charController.node.on(types.Event.HINT_OP_CHAR_RAND, this.onHintOpenCharRand, this);
        if (!this.charController.node.hasEventListener(types.Event.HINT_OP_IN_TREE))
            this.charController.node.on(types.Event.HINT_OP_IN_TREE, this.onHintOpenInTree, this);
        if (!this.charController.node.hasEventListener(types.Event.HINT_OPEN_WORD))
            this.charController.node.on(types.Event.HINT_OPEN_WORD, this.onHintOpenWord, this);
        if (!this.wordsTree.node.hasEventListener(types.Event.RECT_CLICKED))
            this.wordsTree.node.on(types.Event.RECT_CLICKED, this.onTreeRectClicked, this);

        this.isWon = false;
        this.level = level;
        this.wordsTree.initLevel(level);
        this.charController.initLevel(level);

        // применить необязательные переменные
        // задать дефолтные значения
        this.setHSL(...(level?.vis?.hsl || []));
    }

    clear() {
        this.isWon = false;
        this.level = undefined;
        this.wordsTree.clear();
        this.charController.clear();
    }

    setHSL(h?: number, s?: number, l?: number): void {
        if (!h) h = Math.random() * 360;
        if (!s) s = 0;
        if (!l) l = 0;

        let background = this.node.getChildByName('Background') as cc.Node;
        let backHSL = background?.getComponent(HSLController) as HSLController;
        backHSL?.setHSL(h, s, l);
        this.charController.setHSL(h, s, l);
        this.wordsTree.setHSL(h, s, l);
    }
}
