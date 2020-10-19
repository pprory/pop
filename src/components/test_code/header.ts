import UserDom from './abstractDom';

export default class Header extends UserDom<HTMLElement>{

    protected user_dom:HTMLElement;

    public constructor(public contont:string){
        super();
        this.user_dom = document.createElement('header');
        this.user_dom.innerHTML = this.contont;
        this.render(this.user_dom);
    }
    
    protected render(dom:HTMLElement): HTMLElement{
        document.body.appendChild(dom);
        return dom;
    }

}
