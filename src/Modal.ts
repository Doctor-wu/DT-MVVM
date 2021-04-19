import {View} from "./index";
import {ASTConfig, ASTNode} from "./createLayout";

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
        const that = this;
        this._modal = new Proxy(<object><unknown>options, {
            get(target: {}, p: string | symbol, receiver: any): any {
                // console.log('get', p);
                if (View.Target) {
                    that.collectView(View.Target);
                }
                return Reflect.get(target, p, receiver);
            },
            set(target, p, value) {
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
        this.resolveDirectives(config?.directives, config, children)
        const element = {
            tagName: eName,
            type: 'element',
            config,
            children
        };
        children?.forEach(child=>{
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

    resolveDirectives(directives, config: ASTConfig, children?: ASTNode[]) {
        if (!directives) return;
        Object.keys(directives).forEach(key => {
            const resolver = this[`d_${key}`];
            if (resolver == undefined) return;
            resolver.call(this, directives[key], config, children)
        })
    }

    d_for(options, config: ASTConfig, children?: ASTNode[]) {
        console.log(options, config, children)
    }

    parseModal(str: string) {
        return str.replace(/\{%([^%}]+)%\}/g, (...args) => {
            const withFunc = new Function('modal', 'expr', 'with(modal){return eval(expr)}');
            return withFunc(this._modal, args[1]);
        });
    }
}
