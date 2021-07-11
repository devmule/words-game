export enum Event {
    BUTTON_GESTURED = "BUTTON_GESTURED",
    WORD_CREATED = "WORD_CREATED"
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

    // необязательные, в случае если не задано - генерируется случайно или ставится по дефолту
    vis?: LevelVisual
}

