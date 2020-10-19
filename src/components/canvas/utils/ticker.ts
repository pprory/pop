/*
 * @Description: 
 * @Version: 1.0
 * @author: rory
 * @Date: 2020-10-15 16:06:27
 * @LastEditors: rory
 * @LastEditTime: 2020-10-15 17:21:07
 */

import { O_CREAT } from "constants";

/**
 * @description:定时器每秒清空六十次舞台 
 * @param {getConext2D,[宽,高]} 
 * @return {void} 
 * @author: rory
 */

export default function loopClear(ctx: CanvasRenderingContext2D | null,size: number[]) :any{
    // 获取canvas上下文
    const _ctx = ctx;
    // 获取清楚面积
    const [w,h] = size;
    let inith = h;
    let initR = 10;
    function startAnimation(): void{
        if(_ctx){
            _ctx.clearRect(0, 0, w, h);

            _ctx.beginPath();
            _ctx.fillStyle = '#'+('fff0ff');

            _ctx.arc(w/2, inith-=3, initR, 0, 2*Math.PI);
            _ctx.fill();

            if(inith < 150){
                inith = 150;
                initR ++;
            }
        }
        requestAnimationFrame(startAnimation);
        
    }
    // 循环清空
    startAnimation();
}
