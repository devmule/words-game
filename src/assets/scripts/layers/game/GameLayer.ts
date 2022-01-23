import * as cc from 'cc';
import {LevelData, WGEvent} from "../../Types";
import {WordsTree} from "./WordsTree";
import {CharController} from "./CharController";
import {LayerBase} from "../LayerBase";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('GameLayer')
@executeInEditMode
export class GameLayer extends LayerBase {

    private levelData: LevelData | undefined;
    private isWon = false;

    private get charController(): CharController {
        let charControllerNode = this.layerRoot.getChildByName('CharController') as cc.Node;
        return charControllerNode.getComponent(CharController) as CharController;
    }

    private get wordsTree(): WordsTree {
        let wordsTreeNode = this.layerRoot.getChildByName('WordsTree') as cc.Node;
        return wordsTreeNode.getComponent(WordsTree) as WordsTree;
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

        if (!this.wordsTree.isHintOpenDirectlyActive) {
            this.wordsTree.isHintOpenDirectlyActive = true;
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
            .call(() => this.node.emit(WGEvent.ON_LEVEL_WIN))
            .start();
    }

    onTreeRectClicked(x: number, y: number) {
        if (this.isWon) return;

        if (this.wordsTree.isHintOpenDirectlyActive) {
            let wasOpened = this.wordsTree.openRect(x, y);
            if (wasOpened) {
                this.wordsTree.isHintOpenDirectlyActive = false;
                if (this.wordsTree.isWin) this.onWin();
            }
        }
    }

    onLayerClicked(e: cc.Event) {
        if (this.isWon) return;

        if (this.wordsTree.isHintOpenDirectlyActive) {

            let isCharClicked = false;
            for (let target = e.target as cc.Node | null; target != null; target = target.parent)
                if (target.parent === this.wordsTree.node) {
                    isCharClicked = true;
                    break;
                }

            if (!isCharClicked) {
                this.wordsTree.isHintOpenDirectlyActive = false;
            }
        }
    }

    initLevel(level: LevelData): void {

        if (!this.node.hasEventListener(cc.Node.EventType.TOUCH_START))
            this.node.on(cc.Node.EventType.TOUCH_START, this.onLayerClicked, this);
        if (!this.charController.node.hasEventListener(WGEvent.WORD_CREATED))
            this.charController.node.on(WGEvent.WORD_CREATED, this.onWordCreated, this);
        if (!this.charController.node.hasEventListener(WGEvent.HINT_SHUFFLE))
            this.charController.node.on(WGEvent.HINT_SHUFFLE, this.onHintShuffle, this);
        if (!this.charController.node.hasEventListener(WGEvent.HINT_OP_CHAR_RAND))
            this.charController.node.on(WGEvent.HINT_OP_CHAR_RAND, this.onHintOpenCharRand, this);
        if (!this.charController.node.hasEventListener(WGEvent.HINT_OP_IN_TREE))
            this.charController.node.on(WGEvent.HINT_OP_IN_TREE, this.onHintOpenInTree, this);
        if (!this.charController.node.hasEventListener(WGEvent.HINT_OPEN_WORD))
            this.charController.node.on(WGEvent.HINT_OPEN_WORD, this.onHintOpenWord, this);
        if (!this.wordsTree.node.hasEventListener(WGEvent.RECT_CLICKED))
            this.wordsTree.node.on(WGEvent.RECT_CLICKED, this.onTreeRectClicked, this);

        this.isWon = false;
        this.levelData = level;
        this.wordsTree.initLevel(level);
        this.charController.initLevel(level);

    }

    clear() {
        this.isWon = false;
        this.levelData = undefined;
        this.wordsTree.clear();
        this.charController.clear();
    }
}
