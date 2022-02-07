import * as cc from 'cc';

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass("User")
@executeInEditMode
export class User extends cc.Component {

    @property
    public levelIndex: number = 0;

    @property
    public money: number = 0;

}
