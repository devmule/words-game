import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

@ccclass('WidgetMoney')
export class WidgetMoney extends cc.Component {

    @property
    set active(value: boolean) {
        this.node.active = value;
    }

    get active(): boolean {
        return this.node.active;
    }

    @property({visible: false, serializable: true, type: cc.CCInteger, min: 0})
    private _count: number = 0;

    @property
    set count(value: number) {
        if (value === this._count) return;
    }

    get count(): number {
        return this._count;
    }

    start() {
        
    }

}
