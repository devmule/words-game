export enum Event {
    BUTTON_GESTURED = "BUTTON_GESTURED",
    WORD_CREATED = "WORD_CREATED",

    RECT_CLICKED = "RECT_CLICKED",

    HINT_SHUFFLE = "HINT_SHUFFLE",
    HINT_OP_RAND = "HINT_OPEN_RAND",
    HINT_OP_IN_TREE = "HINT_OP_IN_TREE",
    HINT_OPEN_WORD = "HINT_OPEN_WORD",
}


export enum Align {
    /** слева направо */
    hor = 'hor',

    /** сверху вниз */
    ver = 'ver'
}

export type LevelVisual = {
    hsl?: number[]
}

export type InTreeWord = {
    align: keyof typeof Align
    x: number
    y: number
    word: string
}

export type LevelData = {
    letters: string
    words: InTreeWord[]
    w: number
    h: number

    extraWords: string[];

    // необязательные, в случае если не задано - генерируется случайно или ставится по дефолту
    vis?: LevelVisual
}


export const tempLevel: LevelData = {
    letters: "сретка",
    words: [
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
    w: 11,
    h: 7,
    extraWords: [],

    vis: {hsl: [-100, 0, 0]}
};
