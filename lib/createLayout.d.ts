import { NODE_TYPE } from "./constant";
import { primitiveValue } from "./common/types";
import { View } from "./index";
export interface ASTNode {
    type: typeof NODE_TYPE[keyof typeof NODE_TYPE];
    tagName?: string;
    config?: ASTConfig;
    children?: ASTNode[];
    content?: Omit<primitiveValue, 'Symbol'>;
    $parent?: any;
}
export interface ASTConfig {
    style?: object;
    directives?: object;
    bind?: object;
}
export declare function createLayout(this: View, node: ASTNode, modal: any): HTMLElement;
