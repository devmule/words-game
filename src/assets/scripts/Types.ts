export enum Align {
    /** слева направо */
    hor = 'hor',

    /** сверху вниз */
    ver = 'ver'
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
}

