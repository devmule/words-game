import * as cc from 'cc';


const BACKGROUND_NAME = "Background";
const ROOT_NAME = "LayerRoot";


export class LayerBase extends cc.Component {


    get background(): cc.Node {
        return this.node.getChildByName(BACKGROUND_NAME) as cc.Node;
    }

    get layerRoot(): cc.Node {
        return this.node.getChildByName(ROOT_NAME) as cc.Node;
    }


    start() {
        // [3]
    }

    update(dt: number) {
        // [4]
    }
}
