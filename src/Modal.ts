import {primitiveValue} from "../lib/common/types";
import {isPrimitiveValue} from "./utils/util";
import {View} from "./index";

export default class Modal<T = object | primitiveValue> {
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
        if (isPrimitiveValue(options)) this._modal = new Proxy({}, {
            get(_, p: string | symbol): T | undefined {
                // console.log('get', p);
                if (View.Target) {
                    that.collectView(View.Target)
                }
                if (p === 'default') return options;
            },
            set(target, p, value) {
                if (p !== 'default') return false;
                Reflect.set(target, 'default', value);
                that.deps.forEach(dep => {
                    dep.$update();
                });
                return true;
            }
        })
        else this._modal = new Proxy(<object><unknown>options, {
            get(target: {}, p: string | symbol, receiver: any): any {
                // console.log('get', p);
                if (View.Target) {
                    that.collectView(View.Target)
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

    _f(...args) {
        return args;
    }

    _t(str) {
        str = str.replace(/\{%([^%}]+)%\}/g, (...args) => {
            return this._modal[args[1]];
        });
        return {
            type: 'text',
            content: str
        };
    }

    _e(eName, attrs, children) {
        return {
            tagName: eName,
            type: 'element',
            attrs,
            children
        };
    }

    _a(attr) {
        if (!attr) return;
        Object.keys(attr.bind = attr.bind || {}).forEach(key => {
            attr[key] = attr.bind[key].replace(/\{%([^%}]+)%\}/g, (...args) => {
                return this._modal[args[1]];
            });
        })
        return attr;
    }
}
