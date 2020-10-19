/*
 * @Description: 主入口
 * @Version: 1.0
 * @author: rory
 * @Date: 2020-10-15 10:43:28
 * @LastEditors: rory
 * @LastEditTime: 2020-10-16 11:31:11
 */

import App from './components/pixi/App';
export default class Main{
    constructor() {
        new App();        
    }
}

window.onload = ():void => {
    new Main();
}