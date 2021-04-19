import { View } from "./index";
import { ASTConfig, ASTNode } from "./createLayout";
export declare class Modal<T = object> {
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
    _e(eName: any, config: ASTConfig, children?: ASTNode[]): {
        tagName: any;
        type: string;
        config: ASTConfig;
        children: ASTNode[] | undefined;
    };
    _a(attr: any): any;
    resolveDirectives(directives: any, config: ASTConfig, children?: ASTNode[]): void;
    d_for(options: any, config: ASTConfig, children?: ASTNode[]): void;
    parseModal(str: string): string;
}
