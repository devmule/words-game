import * as cc from 'cc';
import * as types from "./Types";
import {WordsTree} from "./WordsTree";
import {CharController} from "./CharController";

const {ccclass, property} = cc._decorator;

@ccclass('GameLayer')
export class GameLayer extends cc.Component {

    private charController: CharController | null | undefined;
    private wordsTree: WordsTree | null | undefined;

    start() {

        let wordsTreeNode = this.node.getChildByName('WordsTree') as cc.Node;
        this.wordsTree = wordsTreeNode.getComponent(WordsTree) as WordsTree;

        let charControllerNode = this.node.getChildByName('CharController') as cc.Node;
        this.charController = charControllerNode.getComponent(CharController) as CharController;

        // fixme temporary
        this.initLevel({
            "letters": "сретка",
            "words": [
                {"align": "hor", "x": 4, "y": 0, "word": "треска"},
                {"align": "ver", "x": 4, "y": 0, "word": "треск"},
                {"align": "ver", "x": 1, "y": 1, "word": "катер"},
                {"align": "hor", "x": 3, "y": 2, "word": "секта"},
                {"align": "hor", "x": 0, "y": 4, "word": "тесак"},
                {"align": "hor", "x": 6, "y": 4, "word": "сетка"},
                {"align": "ver", "x": 7, "y": 2, "word": "арест"},
                {"align": "hor", "x": 3, "y": 6, "word": "крест"},
                {"align": "ver", "x": 9, "y": 2, "word": "аскет"}
            ],
            "w": 11,
            "h": 7
        });
    }

    initLevel(level: types.LevelData) {
        this.wordsTree?.initLevel(level);
        this.charController?.initLevel(level.letters);
    }


}
