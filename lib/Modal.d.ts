import { primitiveValue } from "../lib/common/types";
import { View } from "./index";
export default class Modal<T = object | primitiveValue> {
    private _modal;
    deps: Set<View>;
    depsId: number[];
    constructor(options: T);
    initModal(options: T): void;
    collectView(view: any): void;
    getModal(): any;
    _f(...args: any[]): any[];
    _t(str: any): {
        type: string;
        content: any;
    };
    _e(eName: any, attrs: any, children: any): {
        tagName: any;
        type: string;
        attrs: any;
        children: any;
    };
    _a(attr: any): any;
}
