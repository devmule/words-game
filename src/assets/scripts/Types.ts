export enum Event {

    // game level events
    BUTTON_GESTURED = "BUTTON_GESTURED",
    WORD_CREATED = "WORD_CREATED",

    RECT_CLICKED = "RECT_CLICKED",
    ON_LEVEL_WIN = "ON_LEVEL_WIN",

    // game hints
    HINT_SHUFFLE = "HINT_SHUFFLE",
    HINT_OP_CHAR_RAND = "HINT_OP_CHAR_RAND",
    HINT_OP_IN_TREE = "HINT_OP_IN_TREE",
    HINT_OPEN_WORD = "HINT_OPEN_WORD",

    // menu events
    ON_GO_PLAY_CLICK = "ON_GO_PLAY_CLICK",
    ON_GO_SHOP_CLICK = "ON_GO_SHOP_CLICK",
    ON_GO_LEVEL_CLICK = "ON_GO_LEVEL_CLICK",
}


export enum Align {
    /** слева направо */
    hor = 'hor',

    /** сверху вниз */
    ver = 'ver'
}


/** настройки визуала уровня */
export type LevelVisual = {
    hsl?: [number?, number?, number?]
}

/** настройки слова в дереве слов */
export type InTreeWord = {
    align: keyof typeof Align
    x: number
    y: number
    word: string
}

export type LevelData = {
    letters: string
    words: InTreeWord[]

    extraWords: string[];

    // необязательные, в случае если не задано - генерируется случайно или ставится по дефолту
    vis?: LevelVisual
}


export const tempLevels: LevelData[] = [
    {
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
        extraWords: [],
    },
    {
        "letters": "авостл",
        "words": [
            {"align": "ver", "x": 8, "y": 3, "word": "авост"},
            {"align": "ver", "x": 4, "y": 6, "word": "лото"},
            {"align": "hor", "x": 6, "y": 4, "word": "отвал"},
            {"align": "ver", "x": 6, "y": 1, "word": "сало"},
            {"align": "hor", "x": 2, "y": 2, "word": "слова"},
            {"align": "ver", "x": 1, "y": 4, "word": "слот"},
            {"align": "hor", "x": 1, "y": 4, "word": "сота"},
            {"align": "hor", "x": 8, "y": 6, "word": "стол"},
            {"align": "ver", "x": 4, "y": 0, "word": "стола"}
        ],
        extraWords: [],
    },
    {
        "letters": "матреш",
        "words": [
            {"align": "hor", "x": 1, "y": 3, "word": "армет"},
            {"align": "hor", "x": 7, "y": 7, "word": "март"},
            {"align": "ver", "x": 1, "y": 0, "word": "мера"},
            {"align": "hor", "x": 0, "y": 1, "word": "мета"},
            {"align": "ver", "x": 5, "y": 1, "word": "тема"},
            {"align": "hor", "x": 3, "y": 5, "word": "терма"},
            {"align": "ver", "x": 7, "y": 4, "word": "шарм"},
            {"align": "ver", "x": 5, "y": 1, "word": "шатер"},
            {"align": "hor", "x": 0, "y": 7, "word": "шрам"}
        ],
        extraWords: [],
    },
    {
        "letters": "валоке",
        "words": [
            {"align": "ver", "x": 3, "y": 1, "word": "вокал"},
            {"align": "hor", "x": 6, "y": 5, "word": "воле"},
            {"align": "ver", "x": 1, "y": 5, "word": "волк"},
            {"align": "ver", "x": 5, "y": 0, "word": "елка"},
            {"align": "hor", "x": 3, "y": 3, "word": "клаве"},
            {"align": "ver", "x": 3, "y": 7, "word": "кола"},
            {"align": "ver", "x": 7, "y": 2, "word": "лево"},
            {"align": "hor", "x": 1, "y": 7, "word": "локва"},
            {"align": "hor", "x": 0, "y": 5, "word": "овал"}
        ],
        extraWords: [],
    },
    {
        "letters": "добрат",
        "words": [
            {"align": "ver", "x": 5, "y": 4, "word": "аборт"},
            {"align": "hor", "x": 6, "y": 4, "word": "бард"},
            {"align": "ver", "x": 4, "y": 0, "word": "брат"},
            {"align": "ver", "x": 2, "y": 3, "word": "брод"},
            {"align": "hor", "x": 4, "y": 7, "word": "орда"},
            {"align": "hor", "x": 1, "y": 5, "word": "роба"},
            {"align": "hor", "x": 0, "y": 3, "word": "робат"},
            {"align": "hor", "x": 4, "y": 1, "word": "рота"},
            {"align": "ver", "x": 6, "y": 1, "word": "торба"}
        ],
        extraWords: [],
    },
    {
        "letters": "арбузм",
        "words": [
            {"align": "hor", "x": 0, "y": 5, "word": "амур"},
            {"align": "hor", "x": 1, "y": 3, "word": "арбуз"},
            {"align": "ver", "x": 0, "y": 5, "word": "арум"},
            {"align": "ver", "x": 1, "y": 0, "word": "буза"},
            {"align": "ver", "x": 3, "y": 3, "word": "бурма"},
            {"align": "ver", "x": 7, "y": 5, "word": "заруб"},
            {"align": "hor", "x": 0, "y": 1, "word": "зуб"},
            {"align": "hor", "x": 5, "y": 5, "word": "муза"},
            {"align": "ver", "x": 5, "y": 1, "word": "разум"}
        ],
        extraWords: [],
    }
];


export type UserData = {
    nickname: string
    level: number

    money: number

    hintOpenCharRand: number
    hintOpenWordRand: number
    hintOpenInTree: number
}

export const tempUser: UserData = {
    nickname: 'test user',
    level: 0,

    money: 9999,

    hintOpenCharRand: 10,
    hintOpenWordRand: 10,
    hintOpenInTree: 10,
}
