import * as cc from 'cc';
import {ScreenController} from "./ScreenController";
import * as types from "./Types";
import {GameLayer} from "./GameLayer";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('Root')
@executeInEditMode
export class Root extends cc.Component {

    //<editor-fold desc="/// editor only">
    private _isMenu: boolean = false;

    @property({type: cc.CCBoolean})
    public set isMenu(val: boolean) {
        if (val === this._isMenu) return;

        this._isMenu = val;
        if (val) this.openMenu();
        else this.openLevel(types.tempLevel);
    }

    public get isMenu(): boolean {
        return this._isMenu;
    }

    //</editor-fold>

    @property({type: cc.Prefab})
    public layerMenuPrefab: cc.Prefab | undefined;

    @property({type: cc.Prefab})
    public layerLevelPrefab: cc.Prefab | undefined;

    private screenController: ScreenController | undefined;

    start() {
        this.screenController = this.node.getComponent(ScreenController) as ScreenController;
    }

    openMenu() {
        this.screenController?.closeAll(true);
        let menuNode = cc.instantiate(this.layerMenuPrefab) as unknown as cc.Node;
        this.screenController?.addScreen(menuNode);
    }

    openLevel(levelData: types.LevelData) {
        this.screenController?.closeAll(true);
        let levelNode = cc.instantiate(this.layerLevelPrefab) as unknown as cc.Node;
        let level = levelNode.getComponent(GameLayer) as GameLayer;
        level.initLevel(levelData);
        this.screenController?.addScreen(levelNode);

    }
}
