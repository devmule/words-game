import * as cc from 'cc';
import * as types from "./Types";
import {WordsTree} from "./WordsTree";
import {CharController} from "./CharController";
import {HSLController} from "./HSLController";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('GameLayer')
@executeInEditMode
export class GameLayer extends cc.Component {

    private charController: CharController | undefined;
    private wordsTree: WordsTree | undefined;
    private background: cc.Node | undefined;

    start() {

        let wordsTreeNode = this.node.getChildByName('WordsTree') as cc.Node;
        this.wordsTree = wordsTreeNode.getComponent(WordsTree) as WordsTree;

        let charControllerNode = this.node.getChildByName('CharController') as cc.Node;
        this.charController = charControllerNode.getComponent(CharController) as CharController;
        this.charController.node.on(types.Event.WORD_CREATED, this.onWordCreated, this);

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
            "h": 7,
            vis: {hsl: [180, 0, 0]}
        });
    }

    onWordCreated(word: string) {
        this.wordsTree?.onWordGuess(word);
    }

    initLevel(level: types.LevelData) {

        // задать дефолтные значения
        if (!level.vis) level.vis = {};
        if (!level.vis.hsl) level.vis.hsl = [];
        if (level.vis.hsl[0] === undefined) level.vis.hsl[0] = 0;
        if (level.vis.hsl[0] === undefined) level.vis.hsl[1] = 0;
        if (level.vis.hsl[0] === undefined) level.vis.hsl[2] = 0;

        this.wordsTree?.initLevel(level);
        this.charController?.initLevel(level);

        let background = this.node.getChildByName('Background') as cc.Node;
        let backHSL = background?.getComponent(HSLController) as HSLController;
        if (backHSL) {
            backHSL.H = level?.vis?.hsl && level?.vis?.hsl[0] || 0;
            backHSL.S = level?.vis?.hsl && level?.vis?.hsl[1] || 0;
            backHSL.L = level?.vis?.hsl && level?.vis?.hsl[2] || 0;
        }
    }


}
