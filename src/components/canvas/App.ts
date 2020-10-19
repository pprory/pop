/*
 *                                                     __----~~~~~~~~~~~------___
 *                                    .  .   ~~//====......          __--~ ~~
 *                    -.            \_|//     |||\\  ~~~~~~::::... /~
 *                 ___-==_       _-~o~  \/    |||  \\            _/~~-
 *         __---~~~.==~||\=_    -_--~/_-~|-   |\\   \\        _/~
 *     _-~~     .=~    |  \\-_    '-~7  /-   /  ||    \      /
 *   .~       .~       |   \\ -_    /  /-   /   ||      \   /
 *  /  ____  /         |     \\ ~-_/  /|- _/   .||       \ /
 *  |~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        .\
 *           '         ~-|      /|    |-~\~~       __--~~
 *                       |-~~-_/ |    |   ~\_   _-~            /\
 *                            /  \     \__   \/~                \__
 *                        _--~ _/ | .-~~____--~-/                  ~~==.
 *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||
 *                                  -_     ~\      ~~---l__i__i__i--~~_/
 *                                  _-~-__   ~)  \--______________--~~
 *                                //.-~~~-~_--~- |-------~~~~~~~~
 *                                       //.-~~~--\
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 * @Description: canvasapp
 * @Version: 1.0
 * @author: rory
 * @Date: 2020-10-15 15:17:05
 * @LastEditors: rory
 * @LastEditTime: 2020-10-16 11:25:26
 */

import loopClear from './utils/ticker';

interface initType{
    width:number,
    height:number,
}
export default class CreataScene{

    protected scene_width:  number;
    protected scene_height: number;
    public scene: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D | null;
    
    public constructor(initParams: initType){
        const { width , height } = initParams;

        this.scene_width = width;
        this.scene_height = height;
        this.scene = this.renderScene();
        this.ctx = this.scene.getContext('2d');
        // 循环清空舞台
        loopClear(this.ctx,[this.scene_width,this.scene_width]);
        return this;
    }

    // 创建舞台
    private renderScene(): HTMLCanvasElement{
        const scene =  document.createElement('canvas');
        scene.width = this.scene_width;
        scene.height = this.scene_height;

        document.body.appendChild(scene);
        return scene;
    }
    
}