import * as cc from 'cc';
import {Root} from "./Root";

export function getRoot(): Root {

    let name = "Root";

    let scene = cc.director.getScene();
    if (scene == null) throw new Error(`scene is null`);

    let canvasNode = scene.getChildByName("Canvas");
    if (canvasNode == null) throw new Error(`scene has no canvas`);

    let rootNode = canvasNode.getChildByName(name);
    if (rootNode == null) throw new Error(`canvas has no child \"${name}\"`);

    let rootComponent = rootNode.getComponent(Root);
    if (rootComponent == null) throw new Error(`\"${name}\" has no root component`);

    return rootComponent;

}
