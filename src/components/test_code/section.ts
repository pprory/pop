import UserDom from './abstractDom';

// 装饰器
/* function classtest(target:any){
    target.prototype.test = function(){
        console.log('this is test method')
    }
}

@classtest */

export default class Section extends UserDom<HTMLElement>{
    
    protected user_dom:HTMLElement;

    public constructor(public contont:string){
        super();
        this.user_dom = document.createElement('section');
        this.user_dom.innerHTML = this.contont;
        this.render(this.user_dom);
    }
    
    protected render(dom: HTMLElement): HTMLElement{
        document.body.appendChild(dom);
        return dom;
    }
    public test(): void{
        console.log(123)
    }

}

