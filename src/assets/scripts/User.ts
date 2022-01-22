export type UserData = {

    levelIndex: number

    money: number

    hintOpenCharRand: number
    hintOpenWordRand: number
    hintOpenDirectly: number

}


export class User {

    private _levelIndex: number = 0;

    private _money: number = 0;

    private _hintOpenCharRand: number = 0;
    private _hintOpenWordRand: number = 0;
    private _hintOpenDirectly: number = 0;

    // ===========================================================================

    public init(userdata: UserData) {

        this._levelIndex = userdata.levelIndex;

        this._money = userdata.money;

        this._hintOpenCharRand = userdata.hintOpenCharRand;
        this._hintOpenWordRand = userdata.hintOpenWordRand;
        this._hintOpenDirectly = userdata.hintOpenDirectly;

    }

    public raw(): UserData {

        return {

            levelIndex: this._levelIndex,

            money: this._money,

            hintOpenCharRand: this._hintOpenCharRand,
            hintOpenWordRand: this._hintOpenWordRand,
            hintOpenDirectly: this._hintOpenDirectly,

        };

    }

    // ===========================================================================

    public getLevelIndex(): number {
        return this._levelIndex;
    }

    public incrementLevelIndex(): void {
        this._levelIndex++;
    }

}
