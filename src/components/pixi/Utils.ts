/*
 * @Description: 工具集
 * @Version: 1.0
 * @author: rory
 * @Date: 2020-10-16 13:53:59
 * @LastEditors: rory
 * @LastEditTime: 2020-10-16 16:11:05
 */

import { Application, Graphics, Sprite } from "pixi.js";

export default class Utils{
    /**
     * @param scene 舞台
     */
    public constructor(public scene: Application){

    }

    /**
     * @param target 拖拽的对象
     */
    public drag(target: Sprite | Graphics): Sprite | Graphics{
        
        target.interactive = true;
        target.on('pointerdown',( e: any ): void => {

            // this.scene.stage.setChildIndex(target,8)
            const { data } = e;
            const {x, y} = target.getGlobalPosition();
            let X = data.global.x - x;
            let Y = data.global.y - y;

            target.on('pointermove',( e: any ): void => {

                let { data } = e;
                target.position.set( data.global.x - X, data.global.y - Y);
            })
            target.on('pointerup',()=>{

                target.removeListener('pointermove');
            })
        })

        return target;
    }

    /** 选中 */
    /* public selected(target: Sprite | Graphics): Sprite | Graphics{
        
        target.interactive = true;
        target.on('pointerdown',( e: any ): void => {
            // target.tint = Number('0x' + Math.floor(Math.random() * 16777216).toString(16));
            target.tint = 1110000;
            const { data } = e;
            const {x, y} = target.getGlobalPosition();
            let X = data.global.x - x;
            let Y = data.global.y - y;

            target.on('pointermove',( e: any ): void => {

                let { data } = e;
                target.position.set( data.global.x - X, data.global.y - Y);
            })
            target.on('pointerup',()=>{

                target.removeListener('pointermove');
            })
        })

        return target;
    } */
}