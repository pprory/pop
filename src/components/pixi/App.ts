/*
 * @Description: 拼图
 * @Version: 1.0
 * @author: rory
 * @Date: 2020-10-16 11:25:49
 * @LastEditors: rory
 * @LastEditTime: 2020-10-22 17:09:33
 */

/**
 * 资源图片
 */
const Imagess_path_Arr: string [] = [
    require('../../assets/bg.png'),
    
    require('../../assets/apple.jpg'),
    require('../../assets/pear.jpg'),
    require('../../assets/pepper.jpg'),
    require('../../assets/watermelon.jpg'),
    require('../../assets/tomato.jpg'),
    require('../../assets/yellowpear.jpg'),
];

import gsap, { Back, TweenMax } from 'gsap';
import PixiPlugin from "gsap/PixiPlugin";
import { Application, Loader , Container, ParticleContainer, Sprite} from 'pixi.js';
import * as PIXI from 'pixi.js'
import Utils from './Utils';
import { hasIndexXSpriteType } from './Interfaces';

// 注册pixijs插件
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class App{
    /** app实例 */
    private app: Application;
    /** loader 实例 */
    private loader: Loader;
    /** 列数 */
    private readonly rowNumber:number = 5;
    /** 工具 实例 */
    private utils: Utils;
    /** 舞台宽 */
    private width: number = 500;
    /** 舞台高 */
    private height: number= 500;
    /** 选中的水果 */
    private selectedOBJ: any;
    /** 水果容器 */
    private container: Container = new Container();
    /** 映射水果数组 */
    private mapContainer: [hasIndexXSpriteType[]] = [[]];
    
    public constructor() {
        this.loader = new Loader();
        this.app = new Application({
            autoStart:true,
            width:this.width,
            height:this.height,
            antialias:true,
            transparent:true,
            resolution:1,
        })
       
        this.utils = new Utils(this.app);
        this.loadResource();
        document.body.appendChild(this.app.view);
    }

    /** 加载图片资源 */
    private loadResource(): void{
        this.loader.add([...Imagess_path_Arr]).load( (e): void => {
            console.log('%c 加载成功 %c['+e.progress+'] %c author:panpeng','color:red;font-style: oblique;','color:green;font-size:28px;','color:pink');
            this.createBackgournd();
            this.createFruitsOBJ(this.rowNumber);
        })

        this.loader.onProgress.add( (e): void => {
            console.log('%c 加载中 %c['+ parseInt(e.progress) +']','color:purple','color:green');
        })

        this.loader.onError.add( (e): void => {
            console.log('加载失败~',e)
        })

    }

    /** 创建背景图 */
    private createBackgournd(): void{
        const scene_backgorund = new Container();
        const sprite_background = new Sprite(this.loader.resources[Imagess_path_Arr[0]].texture);

        sprite_background.width = this.width;
        sprite_background.height = this.height;
        sprite_background.position.set(0,0);
        
        scene_backgorund.addChild(sprite_background);
        
        this.app.stage.addChild(scene_backgorund);
    }
    
    /**
     * 生成水果
     * @param {number} 列数
     */
    private createFruitsOBJ(rowNumber:number = 3): void{
        
        // 水果数量
        const num = Math.pow(rowNumber,2);
        const tmpArr: hasIndexXSpriteType[] = [];
        for(let i = 0; i < num; i++){
            const _random = Math.round( 1 + Math.random() * (Imagess_path_Arr.length - 2));
            const _sprite:hasIndexXSpriteType= new Sprite(this.loader.resources[Imagess_path_Arr[ _random ]].texture);
            const row = rowNumber;
            const unitX = Math.floor(this.width / row);
            const unitY = Math.floor(this.height / row);

            // 设置宽高与位置
            _sprite.width = this.width / rowNumber - 5;
            _sprite.height = this.height / rowNumber - 5;
            _sprite.IndexX = i % row;
            _sprite.canMove = false;
            _sprite.IndexY = Math.floor(i / row);
            _sprite.position.set(
                5 + i % row * unitX,
                5 + Math.floor(i / row) * unitY
            )
            // 开启可交互模式
            _sprite.interactive = true;
            _sprite.buttonMode = true;
            _sprite.Id = i;
            _sprite.on('pointerdown', () => {
                if(_sprite.isActive){
                    // 点击当前选中
                    this.clearStatus();
                }else{
                    // 点击未选中
                    if(_sprite.canMove){
                        // 选中周边可移动对象(交换位置)
                        const _x = this.selectedOBJ?.x;
                        const _y = this.selectedOBJ?.y;

                        const _indexX = this.selectedOBJ?.IndexX;
                        const _indexY = this.selectedOBJ?.IndexY;
                        const _Id = this.selectedOBJ?.Id;
                        
                        this.selectedOBJ.IndexX = _sprite.IndexX;
                        this.selectedOBJ.IndexY = _sprite.IndexY;
                        this.selectedOBJ.Id = _sprite.Id;
                        
                        _sprite.IndexX = _indexX;
                        _sprite.IndexY = _indexY;
                        _sprite.Id = _Id;


                        const tmpSprite = this.mapContainer[Number(_sprite.IndexY)][Number(_sprite.IndexX)]
                        this.mapContainer[Number(_sprite.IndexY)][Number(_sprite.IndexX)] = this.mapContainer[Number(this.selectedOBJ.IndexY)][Number(this.selectedOBJ.IndexX)]
                        this.mapContainer[Number(this.selectedOBJ.IndexY)][Number(this.selectedOBJ.IndexX)] = tmpSprite
                        // TweenMax.to(_sprite, 1, { pixi: { scaleX: 1.2, scaleY: 1.2, skewX: 10, rotation: 20 } });
                        TweenMax.to(_sprite, 0.6,{ pixi: { x: _x, y:_y},ease: Back.easeInOut});
                        TweenMax.to( this.selectedOBJ, 0.6,{pixi:{ x: _sprite.x, y:_sprite.y},ease: Back.easeInOut});
                        this.clearStatus();

                        this.WhetherToRemove();

                    }else{
                        // 选中周边不可移动对象(切换活跃对象)
                        this.selectedOBJ = _sprite;
                        _sprite.tint = 12777215;
                        const x: any= _sprite.IndexX;
                        const y: any= _sprite.IndexY;
                        this.clearStatus();
                        _sprite.isActive = true;
                        // console.log(_sprite.IndexX)
                        this.container.children.forEach( (item: any):void => {
                            if(item.IndexX === x && item.IndexY === (y - 1)){
                                item.tint = 12777215;
                                item.canMove = true;
                            }
                            if(item.IndexX === x && item.IndexY === (y + 1)){
                                item.tint = 12777215;
                                item.canMove = true;
                            }
                            if(item.IndexX === (x - 1) && item.IndexY === y){
                                item.tint = 12777215;
                                item.canMove = true;
                            }
                            if(item.IndexX === (x + 1) && item.IndexY === y){
                                item.tint = 12777215;
                                item.canMove = true;
                            }
                        })
                    }
                }
            })
            
            tmpArr.push(_sprite);
            this.container.addChild(_sprite);
        }
        for(let i = 0; i < rowNumber; i++){
            this.mapContainer[i] = tmpArr.slice(i*rowNumber , rowNumber+i*rowNumber);
        }

        this.app.stage.addChild(this.container);

    }

    /**
     * 清空舞台水果附加状态
     */
    private clearStatus(): boolean{
        this.container.children.forEach( (item: any):any => {
            item.tint = 16777215;
            item.canMove = false;
            item.isActive = false;
        })
        return true;
    }

    /**
     * 计算是否构成连对
     */
    private WhetherToRemove(): void{
        this.mapContainer.forEach( (item: any, index: number) => {
            let tmpArr:any = [];
            if(index === 0){
        
            }
        })
    }
    
}
