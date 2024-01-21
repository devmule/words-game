export enum Align {
    /** слева направо */
    hor = 'hor',

    /** сверху вниз */
    ver = 'ver'
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

}
