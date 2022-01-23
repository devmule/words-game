import * as cc from 'cc';
import {LayersController} from "./LayersController";
import {tempLevels, WGEvent, LevelData} from "./Types";
import {GameLayer} from "./layers/game/GameLayer";
import {User} from "./User";
import {ConfigType} from "./configType";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('Root')
@executeInEditMode
export class Root extends cc.Component {

    @property({type: cc.JsonAsset})
    private configAsset: cc.JsonAsset | undefined;

    @property({type: cc.Prefab})
    public layerMenuPrefab: cc.Prefab | undefined;

    @property({type: cc.Prefab})
    public layerLevelPrefab: cc.Prefab | undefined;

    private screenController: LayersController | undefined;
    private user: User = new User();

    public get config(): ConfigType {
        return this.configAsset?.json as ConfigType;
    }

    start() {

        this.user.init({
            levelIndex: 0,
            money: 10000,
        });

        this.screenController = this.node.getComponent(LayersController) as LayersController;
        this.openMenu(true);

    }

    openMenu(immediately: boolean = false) {

        this.screenController?.closeAll(immediately);

        let menuNode = cc.instantiate(this.layerMenuPrefab) as unknown as cc.Node;
        menuNode.on(WGEvent.ON_GO_PLAY_CLICK, this.onPlayClick, this);

        this.screenController?.addLayer(menuNode, immediately);

    }

    openLevel(levelData: LevelData, immediately: boolean = false) {

        this.screenController?.closeAll(immediately);

        let levelNode = cc.instantiate(this.layerLevelPrefab) as unknown as cc.Node;
        levelNode.on(WGEvent.ON_LEVEL_WIN, this.onWin, this);

        let gameLayer = levelNode.getComponent(GameLayer) as GameLayer;
        gameLayer.initLevel(levelData);

        this.screenController?.addLayer(levelNode, immediately);

    }


    // =================================================================================================================
    onWin() {

        this.user.incrementLevelIndex();
        let level = tempLevels[this.user.getLevelIndex()];

        if (!level) {
            this.openMenu();
        } else {
            this.openLevel(level);
        }

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
