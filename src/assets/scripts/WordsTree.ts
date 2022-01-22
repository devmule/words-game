import * as cc from 'cc';
import * as env from "cc/env";
import * as types from "./Types";
import {CharRect} from "./CharRect";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('WordsTree')
@executeInEditMode
export class WordsTree extends cc.Component {

    private level: types.LevelData | undefined;
    private tree: (CharRect | null)[][] = [];
    private words: { [id: string]: CharRect[]; } = {};
    private w: number = 0;
    private h: number = 0;

    @property({type: cc.Prefab})
    public rectPrefab: cc.Prefab | undefined;

    initLevel(level: types.LevelData) {

        this.clear();
        this.level = level;

        for (let i = 0; i < level.words.length; i++) {
            let word = level.words[i] as types.InTreeWord;
            this.w = Math.max(this.w, word.x + (word.align === types.Align.hor ? word.word.length : 1));
            this.h = Math.max(this.h, word.y + (word.align === types.Align.ver ? word.word.length : 1));
        }

        for (let x = 0; x < this.w; x++) {
            this.tree[x] = [];
            for (let y = 0; y < this.h; y++)
                this.tree[x][y] = null;
        }

        const uit = (this.node.getComponent(cc.UITransform) as cc.UITransform).contentSize;
        const squareSize = Math.min(uit.width / this.w, uit.height / this.h);

        for (let i = 0; i < level.words.length; i++) {
            const word: types.InTreeWord = level.words[i];

            this.words[word.word] = [];

            for (let j = 0; j < word.word.length; j++) {
                let x: number, y: number, char = word.word[j];

                if (word.align === types.Align.hor) {
                    x = word.x + j;
                    y = word.y;

                } else if (word.align === types.Align.ver) {
                    x = word.x;
                    y = word.y + j;

                } else {
                    throw new Error(`Level error: Unknown word align type!`);
                }

                this.words[word.word][j] = this.createRect(x, y, squareSize, char);
            }
        }

    }

    createRect(x: number, y: number, squareSize: number, char: string): CharRect {
        if (this.tree[x][y]) return this.tree[x][y] as CharRect;

        const rectNode = cc.instantiate(this.rectPrefab) as unknown as cc.Node;
        this.poseRect(rectNode, x, y, squareSize);
        this.node.addChild(rectNode);

        const rect = rectNode.getComponent(CharRect) as CharRect;
        this.tree[x][y] = rect;
        rect.setSize(squareSize, squareSize);
        rect.text = char;
        rect.close();

        rect.node.on(cc.Node.EventType.TOUCH_START, () => this.node.emit(types.Event.RECT_CLICKED, x, y), this);

        return rect;
    }

    poseRect(rectNode: cc.Node, x: number, y: number, squareSize: number): void {

        let position = cc.v3(
            (x - this.w / 2 + .5) * squareSize,
            -(y - this.h / 2 + .5) * squareSize
        );

        if (env.EDITOR) {
            rectNode.setPosition(position);
        } else {
            const easing = 'backInOut';
            const duration = 1;
            const maxDelay = 1;
            let delay = (x + y) / (this.w + this.h) * maxDelay;

            rectNode.setPosition(-500, 700);

            cc.tween(rectNode)
                .delay(delay)
                .to(duration, {position}, {easing})
                .start();
        }
    }

    destroyTree(): void {
        const level = this.level as types.LevelData;
        const maxIndividualDelay = 1.5;
        const duration = 1;

        for (let x = 0; x < this.w; x++) for (let y = 0; y < this.h; y++) {
            const rect = this.tree[x][y] as CharRect;
            if (rect) {
                const rectNode = rect.node;
                const opacity = rectNode?.getComponent(cc.UIOpacity) as cc.UIOpacity;

                const easing = 'backInOut';
                const scale = cc.v3(0, 0, 0);

                let individualDelay = (x + y) / (this.w + this.h) * maxIndividualDelay;

                cc.tween(rectNode)
                    .delay(individualDelay)
                    .call(() => rect.close())
                    .to(duration, {scale}, {easing})
                    .start();
                cc.tween(opacity)
                    .delay(individualDelay)
                    .to(duration, {opacity: 0}, {easing})
                    .start();
            }
        }
    }

    get isWin(): boolean {
        let unopenedWords = Object.keys(this.words).filter(w => this.words[w].find(r => !r.isOpened));
        return unopenedWords.length === 0;
    }

    openCharRandomly(): void {

        let allWords = Object.keys(this.words);
        let maxLen = allWords.reduce((m, w) => Math.max(w.length, m), 0);

        for (let i = 0; i < allWords.length; i++) {
            maxLen = Math.max(maxLen, allWords[i].length);
            let j = i + Math.floor(Math.random() * (allWords.length - i));
            [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
        }

        for (let offset = 0; offset < maxLen; offset++) {
            for (let i = 0; i < allWords.length; i++) {

                let textWord = allWords[i];
                let rectWord = this.words[textWord];

                if (rectWord[offset] !== undefined) {
                    if (!rectWord[offset].isOpened) {

                        // если нашлась подходящая не открытая буква - открыть её и завершить функцию
                        rectWord[offset].open();
                        return;

                    }

                } else {
                    // если слово уже закончилось - убрать его из списка
                    allWords.splice(i, 1);
                    i--;
                }
            }
        }
    }

    openWordRandomly(): void {
        let unopenedWords = Object.keys(this.words).filter(w => this.words[w].find(r => !r.isOpened));
        if (unopenedWords.length === 0) return;

        // open random word
        this.openWord(unopenedWords[Math.floor(Math.random() * unopenedWords.length)]);
    }

    openWord(word: string): boolean {
        let isWordGuessed = false;
        word = word.toLowerCase();

        if (word in this.words && this.words[word]) {
            // слово такое есть!

            const rects = this.words[word];
            // такое слово угадано полностью?
            let isOpenedAlready = !rects.find((r: CharRect) => !r.isOpened);

            if (!isOpenedAlready) {
                // не все буквы в слове угаданы, открыть все буквы
                isWordGuessed = true;
                let inTreeWord = this.level?.words.find((w: types.InTreeWord) => w.word === word) as types.InTreeWord;

                for (let i = 0; i < inTreeWord.word.length; i++) this.openRect(
                    inTreeWord.x + (inTreeWord.align === types.Align.hor ? i : 0),
                    inTreeWord.y + (inTreeWord.align === types.Align.ver ? i : 0),
                    i * 0.1
                );
            }
        }

        return isWordGuessed;
    }

    openRect(x: number, y: number, delay: number = 0): boolean {
        let rect = this.tree[x][y] as CharRect;
        if (!rect.isOpened) {
            rect.open(delay);
            return true;
        }
        return false;
    }

    clear() {
        while (this.node.children.length) this.node.children[0].removeFromParent();

        this.level = undefined;
        this.words = {};
        this.tree = [];
        this.w = this.h = 0;
    }
}
