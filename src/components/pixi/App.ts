/*
 * @Description: 拼图
 * @Version: 1.0
 * @author: rory
 * @Date: 2020-10-16 11:25:49
 * @LastEditors: rory
 * @LastEditTime: 2020-10-19 10:14:13
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
    /** 工具 实例 */
    private utils: Utils;
    /** 舞台宽 */
    private width: number = 500;
    /** 舞台高 */
    private height: number= 500;
    /** 地图位置数组 (保存九宫格位置信息) */
    private mapPositionArr: Array<object>; 
    /** 选中的水果 */
    private selectedOBJ: any;
    /** 水果容器 */
    private container: Container = new Container();

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
        this.mapPositionArr = this.calcTileXY();
        document.body.appendChild(this.app.view);
    }

    /** 加载图片资源 */
    private loadResource(): void{
        this.loader.add([...Imagess_path_Arr]).load( (e): void => {
            console.log('%c 加载成功 %c['+e.progress+'] %c author:panpeng','color:red;font-style: oblique;','color:green;font-size:28px;','color:pink');
            this.createBackgournd();
            this.createFruitsOBJ();
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
     * @param num 宫格位置计算(默认9) row 列数
     */
    private calcTileXY(num: number = 64,rowSize: number = 8): Array<Object>{
        
        const row = rowSize;
        const unitX = Math.floor(this.width / row);
        const unitY = Math.floor(this.height / row);
        let tmpArr:Object[] = [];
        for(let i = 0; i < num; i++){
            tmpArr.push({
                x: i % row * unitX,
                y: Math.floor(i / row) * unitY
            })
        }
        const res = [[...tmpArr.slice(0,rowSize)],[...tmpArr.slice(rowSize,rowSize*2)],[...tmpArr.slice(rowSize*2,rowSize*3)]]
        return res;
    }

    /**
     * 生成可操纵对象
     */
    private createFruitsOBJ(num: number = 64,rowSize: number = 8): void{

        for(let i = 0; i < num; i++){

            const _random = Math.round( 1 + Math.random() * (Imagess_path_Arr.length - 2));
            const _sprite:hasIndexXSpriteType= new Sprite(this.loader.resources[Imagess_path_Arr[ _random ]].texture);
            const row = rowSize;
            const unitX = Math.floor(this.width / row);
            const unitY = Math.floor(this.height / row);

            // 设置宽高与位置
            _sprite.width = this.width / rowSize - 5;
            _sprite.height = this.height / rowSize - 5;
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
                        
                        this.selectedOBJ.IndexX = _sprite.IndexX;
                        this.selectedOBJ.IndexY = _sprite.IndexY;
                        
                        _sprite.IndexX = _indexX;
                        _sprite.IndexY = _indexY;

                        // TweenMax.to(_sprite, 1, { pixi: { scaleX: 1.2, scaleY: 1.2, skewX: 10, rotation: 20 } });
                        TweenMax.to(_sprite, 0.6,{ pixi: { x: _x, y:_y},ease: Back.easeInOut});
                        TweenMax.to( this.selectedOBJ, 0.6,{pixi:{ x: _sprite.x, y:_sprite.y},ease: Back.easeInOut});
                        this.clearStatus();
                    }else{
                        // 选中周边不可移动对象(切换活跃对象)
                        this.selectedOBJ = _sprite;
                        _sprite.tint = 12777215;
                        const x: any= _sprite.IndexX;
                        const y: any= _sprite.IndexY;
                        this.clearStatus();
                        _sprite.isActive = true;
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
            
            this.container.addChild(_sprite);
            this.WhetherToRemove();
        }

        this.app.stage.addChild(this.container);
    }

    /**
     * 清空舞台水果附加状态
     */
    private clearStatus(): boolean{
        this.WhetherToRemove();
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
    private WhetherToRemove(): boolean{
        this.container.children.forEach( (item: any,index: number) =>{

            const textureName:string = item.texture.textureCacheIds[0];
            const X:number = item.IndexX;
            const Y:number = item.IndexY;
            let tmpArrayX:any[] = [];
            let tmpArrayY:any[] = [];
            this.container.children.forEach( ( _item: any, _index:number) =>{
                if(_item.IndexX === X && (_item.IndexY) - Y < 3){
                    // _item.tint = 12777215;
                    tmpArrayX.push(_item);

                    tmpArrayX.length===3&&(()=>{
                        if(tmpArrayX[0].texture.textureCacheIds[0] === tmpArrayX[1].texture.textureCacheIds[0] && tmpArrayX[0].texture.textureCacheIds[0]===tmpArrayX[2].texture.textureCacheIds[0])
                        {
                            console.log('X连上了')
                            tmpArrayX.forEach( tmpXItem =>{
                                this.container.removeChild(tmpXItem)
                            })
                            tmpArrayX = [];
                        }
                    })();

                }
                if(_item.IndexY === Y && (_item.IndexX) - X < 3){
                    // _item.tint = 12777215;
                    tmpArrayY.push(_item);

                    tmpArrayY.length===3&&(()=>{
                        if(tmpArrayY[0].texture.textureCacheIds[0] === tmpArrayY[1].texture.textureCacheIds[0] && tmpArrayY[0].texture.textureCacheIds[0]===tmpArrayY[2].texture.textureCacheIds[0])
                        {
                            console.log('Y连上了')
                            tmpArrayY.forEach( tmpYItem =>{
                                this.container.removeChild(tmpYItem)
                            })

                            tmpArrayY = [];
                        }
                    })();
                }
                
            })
        })
        
        return false;
    }
    
}
