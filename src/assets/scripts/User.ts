import * as types from "./Types";


export type UserData = {
    nickname: string
    level: number

    money: number

    hintOpenCharRand: number
    hintOpenWordRand: number
    hintOpenInTree: number
}


export class User {

    public nickname: string = '';
    public level: number = 0;

    public money: number = 0;

    private hintOpenCharRand: number = 0;
    private hintOpenWordRand: number = 0;
    private hintOpenInTree: number = 0;

    init(userdata: UserData) {

        this.nickname = userdata.nickname;
        this.level = userdata.level;

        this.money = userdata.money;

        this.hintOpenCharRand = userdata.hintOpenCharRand;
        this.hintOpenWordRand = userdata.hintOpenWordRand;
        this.hintOpenInTree = userdata.hintOpenInTree;

    }

    raw(): UserData {

        return {

            nickname: this.nickname,
            level: this.level,

            money: this.money,

            hintOpenCharRand: this.hintOpenCharRand,
            hintOpenWordRand: this.hintOpenWordRand,
            hintOpenInTree: this.hintOpenInTree,

        };

    }

}
