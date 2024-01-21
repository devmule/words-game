import * as cc from 'cc';
import {ConfigType} from "./configType";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('Config')
@executeInEditMode
export class Config extends cc.Component {

    @property({type: cc.JsonAsset})
    private configAsset: cc.JsonAsset | undefined;

    public get config(): ConfigType {
        return this.configAsset?.json as ConfigType;
    }

}
