type GameConfigColorType = {
    dark: string
    light: string
}

type GameHintConfigType = {
    price: number
}

type GameConfigType = {
    visual: {
        color_primary: GameConfigColorType
        color_secondary: GameConfigColorType
        color_highlight: GameConfigColorType
    },
    logic: {
        hint: {
            shuffle: GameHintConfigType,
            open_char_rand: GameHintConfigType,
            open_directly: GameHintConfigType,
            open_word_rand: GameHintConfigType
        }
    }
}


type InAppsConfigType = {}

type AdMobConfigType = {}

type DevToDevConfigType = {}

export type ConfigType = {
    game: GameConfigType,
    inapps: InAppsConfigType,
    admob: AdMobConfigType,
    devtodev: DevToDevConfigType
}

