import * as cc from 'cc';
import * as types from "./Types";
import {Rect} from "./Rect";
import {HSLController} from "./HSLController";

const {ccclass, property} = cc._decorator;

@ccclass('WordsTree')
export class WordsTree extends cc.Component {

    private level: types.LevelData | undefined;
    private tree: (Rect | null)[][] = [];
    private words: { [id: string]: boolean; } = {};

    @property({type: cc.Prefab})
    public rectPrefab: cc.Prefab | undefined;

    initLevel(level: types.LevelData) {

        this.clear();
        this.level = level;

        for (let x = 0; x < level.w; x++) {
            this.tree[x] = [];
            for (let y = 0; y < level.h; y++)
                this.tree[x][y] = null;
        }

        const uit = (this.node.getComponent(cc.UITransform) as cc.UITransform).contentSize;
        const squareSize = Math.min(uit.width / level.w, uit.height / level.h);

        for (let i = 0; i < level.words.length; i++) {
            const word: types.InTreeWord = level.words[i];

            this.words[word.word] = true;

            for (let j = 0; j < word.word.length; j++) {
                let x: number, y: number;

                if (word.align === types.Align.hor) {
                    x = word.x + j;
                    y = word.y;

                } else if (word.align === types.Align.ver) {
                    x = word.x;
                    y = word.y + j;

                } else {
                    throw new Error(`Level error: Unknown word align type!`);
                }

                this.createRect(x, y, squareSize);
            }
        }

    }

    createRect(x: number, y: number, squareSize: number) {
        const rectNode = cc.instantiate(this.rectPrefab) as unknown as cc.Node;
        rectNode.setPosition(
            (x - (this.level as types.LevelData).w / 2 + .5) * squareSize,
            -(y - (this.level as types.LevelData).h / 2 + .5) * squareSize
        );
        this.node.addChild(rectNode);

        const rect = rectNode.getComponent(Rect) as Rect;
        this.tree[x][y] = rect;
        rect.setSize(squareSize, squareSize);
    }

    onWordGuess(word: string): boolean {
        let isWordGuessed = false;

        word = word.toLowerCase();

        if (word in this.words && this.words[word]) {
            isWordGuessed = true;
            this.words[word] = false;

            let inTreeWord = this.level?.words.find((w: types.InTreeWord) => w.word === word) as types.InTreeWord;

            for (let i = 0; i < inTreeWord.word.length; i++) {

                let x = inTreeWord.x + (inTreeWord.align === types.Align.hor ? i : 0),
                    y = inTreeWord.y + (inTreeWord.align === types.Align.ver ? i : 0);

                let rect = this.tree[x][y] as Rect;
                rect.text = inTreeWord.word[i] as string;
            }
        }

        return isWordGuessed;
    }

    clear() {

        for (let i = 0; i < this.tree.length; i++) {
            for (let j = 0; j < this.tree[i].length; j++) {
                if (this.tree[i][j] instanceof Rect)
                    (this.tree[i][j] as unknown as Rect).node.removeFromParent();
            }
        }

        this.level = undefined;
        this.words = {};
        this.tree = [];
    }

    setHSL(h: number, s: number, l: number) {
        for (let i = 0; i < this.tree.length; i++) {
            for (let j = 0; j < this.tree[i].length; j++) {
                if (this.tree[i][j] instanceof Rect) {
                    let rectNode = (this.tree[i][j] as unknown as Rect).node;
                    const rectHSL = rectNode.getChildByName('Back')?.getComponent(HSLController) as HSLController;
                    rectHSL.setHSL(h, s, l);
                }
            }
        }
    }
}
