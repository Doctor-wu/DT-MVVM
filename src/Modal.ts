import {View} from "./index";
import {ASTConfig, ASTNode} from "./createLayout";
import {isPrimitiveValue} from "./utils/util";

let readLocking = false;
let pid = 0;
const proxied = Symbol('proxied');
export class Modal<T = object> {
    private _modal: any;
    public deps: Set<View>;
    public depsId: number[];

    constructor(options: T) {
        this.deps = new Set;
        this.depsId = [];
        this.initModal(options);
    }

    initModal(options: T) {
        this._modal = this.reactive(options);
    }

    reactive(obj) {
        const that = this;
        console.log(pid++)
        return new Proxy(<object><unknown>obj, {
            get(target: {}, p: string | symbol, receiver: any): any {
                // console.log('get', p);
                if(p === proxied) return true;
                let value = Reflect.get(target, p, receiver);
                if(!isPrimitiveValue(value) && !readLocking && !value[proxied]){
                    readLocking = true;
                    value = that.reactive(value);
                    Reflect.set(target, p, value);
                    readLocking = false;
                }
                if (View.Target) {
                    that.collectView(View.Target);
                }
                return value;
            },
            set(target, p, value) {
                // console.log('set', p);
                if(!isPrimitiveValue(value) && !value[proxied]) value = that.reactive(value);
                Reflect.set(target, p, value);
                that.deps.forEach(dep => {
                    dep.$update();
                });
                return true;
            }
        });
    }

    collectView(view) {
        this.deps.add(view);
    }

    getModal() {
        return this._modal;
    }

    // 解析多个子元素
    _f(...args) {
        return args;
    }

    //解析Text
    _t(str) {
        // eslint-disable-next-line no-unused-vars
        str = this.parseModal(str);
        return {
            type: 'text',
            content: str
        };
    }

    // 解析Element
    _e(eName, config: ASTConfig, children?: ASTNode[]) {
        const element = {
            tagName: eName,
            type: 'element',
            config,
            children
        };
        children?.forEach(child => {
            child.$parent = element;
        })
        return element;
    }

    // 解析Attr
    _a(attr) {
        if (!attr) return;
        Object.keys(attr.bind = attr.bind || {}).forEach(key => {
            attr[key] = this.parseModal(attr.bind[key]);
        })
        return attr;
    }

    parseModal(str: string) {
        return str.replace(/\{%([^%}]+)%\}/g, (...args) => {
            const withFunc = new Function('modal', 'expr', 'with(modal){return eval(expr)}');
            return withFunc(this._modal, args[1]);
        });
    }
}
