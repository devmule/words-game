import * as cc from 'cc';

export const WGEvent = cc.Enum({

    // game level events
    BUTTON_GESTURED: "BUTTON_GESTURED",
    WORD_CREATED: "WORD_CREATED",

    RECT_CLICKED: "RECT_CLICKED",
    ON_LEVEL_WIN: "ON_LEVEL_WIN",

    // game hints
    HINT_SHUFFLE: "HINT_SHUFFLE",
    HINT_OP_CHAR_RAND: "HINT_OP_CHAR_RAND",
    HINT_OP_IN_TREE: "HINT_OP_IN_TREE",
    HINT_OPEN_WORD: "HINT_OPEN_WORD",

})
