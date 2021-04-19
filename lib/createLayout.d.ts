import { NODE_TYPE } from "./constant";
import { primitiveValue } from "./common/types";
import { View } from "./index";
export interface VNode {
    type: typeof NODE_TYPE[keyof typeof NODE_TYPE];
    tagName?: string;
    attrs?: object | null;
    children?: VNode[];
    bind?: {};
    content?: Omit<primitiveValue, 'Symbol'>;
}
export declare function createLayout(this: View, node: VNode, modal: any): HTMLElement;
