import * as cc from 'cc';
import {ScreenController} from "./ScreenController";
import {tempLevels, WGEvent, LevelData} from "./Types";
import {GameLayer} from "./GameLayer";
import {User} from "./User";

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
        else this.openLevel(tempLevels[0]);
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
    private user: User = new User();

    start() {

        this.user.init({

            levelIndex: 0,

            money: 9999,

            hintOpenCharRand: 10,
            hintOpenWordRand: 10,
            hintOpenDirectly: 10,

        });

        this.screenController = this.node.getComponent(ScreenController) as ScreenController;
        this.openMenu(true);

    }

    openMenu(immediately: boolean = false) {

        this.screenController?.closeAll(immediately);

        let menuNode = cc.instantiate(this.layerMenuPrefab) as unknown as cc.Node;
        menuNode.on(WGEvent.ON_GO_PLAY_CLICK, this.onPlayClick, this);

        this.screenController?.addScreen(menuNode, immediately);

    }

    openLevel(levelData: LevelData, immediately: boolean = false) {

        this.screenController?.closeAll(immediately);

        let levelNode = cc.instantiate(this.layerLevelPrefab) as unknown as cc.Node;
        levelNode.on(WGEvent.ON_LEVEL_WIN, this.onWin, this);

        let level = levelNode.getComponent(GameLayer) as GameLayer;
        level.initLevel(levelData);

        this.screenController?.addScreen(levelNode, immediately);

    }


    // =================================================================================================================
    onWin() {

        this.user.incrementLevelIndex();
        let level = tempLevels[this.user.getLevelIndex()];

        this.openLevel(level);

    }

    onPlayClick() {
        let levelIndex = this.user.getLevelIndex()
        let levelData = tempLevels[levelIndex];
        if (levelData != null) {
            this.openLevel(levelData);
        } else {
            this.openMenu();
        }
    }
}
