import {View} from "./index";
import {ASTConfig, ASTNode} from "./createLayout";
import {isPrimitiveValue} from "./utils/util";

let readLocking = false;
let pid = 0;
const proxied = Symbol('proxied');

export class Modal<T = object> {
    private _modal: any;
    public deps: Set<View>;

    constructor(options: T) {
        this.deps = new Set;
        this.initModal(options);
    }

    initModal(options: T) {
        this._modal = this.reactive(options);
    }

    reactive(obj) {
        const that = this;
        obj._pid = pid++;
        return new Proxy(<object><unknown>obj, {
            get(target: {}, p: string | symbol, receiver: any): any {
                // console.log('get', p);
                if (p === proxied) return true;
                let value = Reflect.get(target, p, receiver);
                if (!isPrimitiveValue(value) && !readLocking && !value[proxied]) {
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
                if (!isPrimitiveValue(value) && !value[proxied]) value = that.reactive(value);
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

    resolveDirectives(attr: ASTConfig): void {
        const directives = attr?.directives || null;
        if (!directives) return undefined;
        Object.keys(directives).forEach(key => {
            const resolver = this[`d_${key}`];
            if (resolver == undefined) return;
            resolver.call(this, attr)
        });
    }

    // 解析多个子元素
    _f(...args) {
        return args;
    }

    //解析Text
    _t(str) {
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
        return element;
    }

    // 解析for指令
    _l(expr, func) {
        const list: any[] = eval(`this._modal.${expr}`);
        const elements: any[] = [];
        list.forEach(item => {
            elements.push(func.call(this, item));
        });
        return elements;
    }

    // 解析Attr
    _a(attr) {
        if (!attr) return;
        this.resolveDirectives(attr);
        Object.keys(attr.bind = attr.bind || {}).forEach(key => {
            attr[key] = this.parseModal(attr.bind[key]);
        })
        return attr;
    }

    // 解析表达式
    _s(expr) {
        return eval(`this.${expr} || this._modal?.${expr}`);
    }

    d_bind(attr: ASTConfig) {
        const bind = (attr.directives as any).bind.expr;
        let value = (attr.directives as any).bind.value;
        (attr.directives as any).bind.value = this.parseModal(value);
        const fn = new Function("attr", "with(this){return eval(`new Object(${attr.directives.bind.value})`)}");
        attr[bind] = fn.call(this, attr);
    }

    parseModal(str: string) {
        if (!str) return "";
        return str.replace(/\{%([^%}]+)%\}/g, (...args) => {
            //@ts-ignore
            const key = args[1];
            return eval("`this._modal.${key}`")
        });
    }
}


export function omitWrap(str) {
    if (!str) return "";
    return str.replace(/\{%([^%}]+)%\}/g, (...args) => {
        return `" + _s('${args[1]}') + "`;
    });
}
