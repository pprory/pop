export default abstract class UserDom<T>{

    protected abstract render(dom: T): T;
    protected abstract user_dom:T;

}