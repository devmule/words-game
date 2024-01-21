import * as cc from 'cc';

export function findComponent<T extends cc.Component>(compType: cc.__private.Constructor<T>, root?: cc.BaseNode): T | undefined {

    if (!root) root = cc.director.getScene() ?? undefined;
    if (!root) return undefined;

    for (let i = 0; i < root.components.length; i++) {
        let component = root.components[i];
        if (component instanceof compType) return component;
    }

    for (let i = 0; i < root.children.length; i++) {
        let child = root.children[i];
        let comp = findComponent(compType, child);
        if (comp) return comp;
    }

    return undefined;

}
