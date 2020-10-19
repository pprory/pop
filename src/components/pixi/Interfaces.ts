/*
 * @Description: 接口
 * @Version: 1.0
 * @author: rory
 * @Date: 2020-10-16 16:09:16
 * @LastEditors: rory
 * @LastEditTime: 2020-10-16 16:42:41
 */
import { Sprite } from 'pixi.js';


// 带IndexX属性的接口
interface hasIndexXSpriteType extends Sprite{
    IndexX?:number;
    IndexY?:number;
    canMove?:boolean;
    isActive?:boolean;
}

export{
    hasIndexXSpriteType
}