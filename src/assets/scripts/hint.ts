import * as cc from 'cc';


/**
 * 
 * Создается сам енумератор. Важно - не использовать текстовые значения
 * hint
 * Hint
 * devmule
 * Mon Jan 22 2024 09:31:18 GMT+0400 (Грузия, стандартное время)
 * hint.ts
 * hint
 * db://assets/scripts/hint.ts
 * https://docs.cocos.com/creator/3.8/manual/en/
 *
 */

export enum Hint {
    SHUFFLE,
    RANDOMIZE,
    OPEN_WORD,
    OPEN_LETTER,
}

/**
 * Енумератор учитывается кокосом
 */
cc.Enum(Hint);