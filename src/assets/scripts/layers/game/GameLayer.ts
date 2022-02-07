import * as cc from 'cc';
import {WGEvent} from "../../WGEvent";
import {LevelData} from "../../Core/LevelTypes";
import {WordsTree} from "./WordsTree";
import {CharController} from "./CharController";
import {findComponent} from "../../Core/Utils";
import {Levels} from "../../Core/Levels";
import {User} from "../../User";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('GameLayer')
@executeInEditMode
export class GameLayer extends cc.Component {

    private levelData: LevelData | undefined;
    private isWon = false;
    private charController: CharController = new CharController();
    private wordsTree: WordsTree = new WordsTree();

    start() {

        let charControllerNode = this.node.getChildByName('CharController') as cc.Node;
        this.charController = charControllerNode.getComponent(CharController) as CharController;
        if (!this.charController) throw new Error(`charController is not implemented`);

        let wordsTreeNode = this.node.getChildByName('WordsTree') as cc.Node;
        this.wordsTree = wordsTreeNode.getComponent(WordsTree) as WordsTree;
        if (!this.wordsTree) throw new Error(`wordsTree is not implemented`);

        this.node.on(cc.Node.EventType.TOUCH_START, this.onLayerClicked, this);
        this.charController.node.on(WGEvent.WORD_CREATED, this.onWordCreated, this);
        this.charController.node.on(WGEvent.HINT_SHUFFLE, this.onHintShuffle, this);
        this.charController.node.on(WGEvent.HINT_OP_CHAR_RAND, this.onHintOpenCharRand, this);
        this.charController.node.on(WGEvent.HINT_OP_IN_TREE, this.onHintOpenInTree, this);
        this.charController.node.on(WGEvent.HINT_OPEN_WORD, this.onHintOpenWord, this);
        this.wordsTree.node.on(WGEvent.RECT_CLICKED, this.onTreeRectClicked, this);


        const user = findComponent(User);
        if (!user) throw new Error(`user is not implemented`);

        const levels = findComponent(Levels);

        if (!levels) throw new Error(`levels is not implemented`);

        console.log(levels, user, levels.levels[user.levelIndex])

        this.initLevel(levels.levels[user.levelIndex]);

    }

    initLevel(level: LevelData): void {

        this.isWon = false;
        this.levelData = level;
        this.wordsTree.initLevel(level);
        this.charController.initLetters(level.letters);

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

    clear() {
        this.isWon = false;
        this.levelData = undefined;
        this.wordsTree.clear();
        this.charController.clear();
    }
}
