import * as cc from 'cc';
import {LevelData} from "./LevelTypes";

const {ccclass, property} = cc._decorator;

@ccclass('Levels')
export class Levels extends cc.Component {

    @property({type: cc.JsonAsset})
    private levelsAsset: cc.JsonAsset | undefined;

    public get levels(): LevelData[] {
        return this.levelsAsset?.json as LevelData[];
    }

    public getLevelByIndex(index: number): LevelData | null {
        return this.levels[index] ?? null;
    }

}
