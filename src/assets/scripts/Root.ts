import * as cc from 'cc';
import {ScreenController} from "./ScreenController";
import * as types from "./Types";
import {GameLayer} from "./GameLayer";
import {Player} from "./Player";
import {LevelData} from "./Types";

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
        else this.openLevel(types.tempLevels[0]);
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
    private player: Player | undefined;

    start() {
        this.player = new Player(types.tempUser);

        this.screenController = this.node.getComponent(ScreenController) as ScreenController;
        this.openMenu(true);
    }

    openMenu(immediately: boolean = false) {
        this.screenController?.closeAll(immediately);

        let menuNode = cc.instantiate(this.layerMenuPrefab) as unknown as cc.Node;
        menuNode.on(types.Event.ON_GO_PLAY_CLICK, this.onPlayClick, this);

        this.screenController?.addScreen(menuNode, immediately);
    }

    openLevel(levelData: types.LevelData, immediately: boolean = false) {
        this.screenController?.closeAll(immediately);

        let levelNode = cc.instantiate(this.layerLevelPrefab) as unknown as cc.Node;
        levelNode.on(types.Event.ON_LEVEL_WIN, this.onWin, this);

        let level = levelNode.getComponent(GameLayer) as GameLayer;
        level.initLevel(levelData);

        this.screenController?.addScreen(levelNode, immediately);
    }


    // =================================================================================================================
    onWin() {
        let player = this.player as Player;
        player.userdata.level++;

        if (player.userdata.level >= types.tempLevels.length) player.userdata.level = 0;
        let level = types.tempLevels[player.userdata.level];

        this.openLevel(level);
    }

    onPlayClick() {
        this.openLevel(types.tempLevels[(this.player as Player).userdata.level]);
    }
}
