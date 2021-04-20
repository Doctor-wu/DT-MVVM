import { View } from "./index";
import { ASTConfig, ASTNode } from "./createLayout";
export declare class Modal<T = object> {
    private _modal;
    deps: Set<View>;
    constructor(options: T);
    initModal(options: T): void;
    reactive(obj: any): {};
    collectView(view: any): void;
    getModal(): any;
    resolveDirectives(attr: ASTConfig): void;
    _f(...args: any[]): any[];
    _t(str: any): {
        type: string;
        content: any;
    };
    _e(eName: any, config: ASTConfig, children?: ASTNode[]): {
        tagName: any;
        type: string;
        config: ASTConfig;
        children: ASTNode[] | undefined;
    };
    _l(expr: any, func: any): any[];
    _a(attr: any): any;
    _s(expr: any): any;
    d_bind(attr: ASTConfig): void;
    parseModal(str: string): string;
}
export declare function omitWrap(str: any): any;
