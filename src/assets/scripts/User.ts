import {getRoot} from "./Utils";

export type UserData = {

    levelIndex: number
    money: number

}


export class User {

    private _levelIndex: number = 0;
    private _money: number = 0;

    // ===========================================================================

    public init(userdata: UserData) {

        this._levelIndex = userdata.levelIndex;
        this._money = userdata.money;

    }

    public raw(): UserData {

        return {

            levelIndex: this._levelIndex,
            money: this._money,

        };

    }

    public get money(): number {
        return this._money;
    }

    // ===========================================================================

    public getLevelIndex(): number {
        return this._levelIndex;
    }

    public incrementLevelIndex(): void {
        this._levelIndex++;
    }

    // ===========================================================================

    public getHintOpenCharRandPrice(): number {
        return getRoot().config.game.logic.hint.open_char_rand.price;
    }

    public canUseHintOpenCharRand(): boolean {
        return this._money >= this.getHintOpenCharRandPrice();
    }

    public useHintOpenCharRand(): boolean {
        if (this.canUseHintOpenCharRand()) {
            this._money -= this.getHintOpenCharRandPrice();
            return true;
        }
        return false
    }

    // ===========================================================================

    public getHintOpenWordRandPrice(): number {
        return getRoot().config.game.logic.hint.open_word_rand.price;
    }

    public canUseHintOpenWordRand(): boolean {
        return this._money >= this.getHintOpenWordRandPrice();
    }

    public useHintOpenWordRand(): boolean {
        if (this.canUseHintOpenWordRand()) {
            this._money -= this.getHintOpenWordRandPrice()
            return true;
        }
        return false
    }

    // ===========================================================================

    public getHintOpenDirectlyPrice(): number {
        return getRoot().config.game.logic.hint.open_directly.price;
    }

    public canUseHintOpenDirectly(): boolean {
        return this._money >= this.getHintOpenDirectlyPrice();
    }

    public useHintOpenDirectly(): boolean {
        if (this.canUseHintOpenDirectly()) {
            this._money -= this.getHintOpenDirectlyPrice();
            return true;
        }
        return false
    }

    // ===========================================================================

    public getHintShufflePrice(): number {
        return getRoot().config.game.logic.hint.shuffle.price;
    }

    public canUseHintShuffle(): boolean {
        return this._money >= this.getHintShufflePrice();
    }

    public useHintShuffle(): boolean {
        if (this.canUseHintShuffle()) {
            this._money -= this.getHintShufflePrice();
            return true;
        }
        return false
    }

}
