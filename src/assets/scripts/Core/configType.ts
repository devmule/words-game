type GameHintConfigType = {
    price: number
}

type GameConfigType = {
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

