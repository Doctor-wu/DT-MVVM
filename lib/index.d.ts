import { ASTNode } from "./createLayout";
import type { Modal as _Modal } from "./Modal";
import { primitiveValue } from "./common/types";
export declare const Modal: any;
export declare class View {
    rootElement: HTMLElement | null;
    $el: HTMLElement;
    $modal: _Modal;
    modalSet: Set<_Modal>;
    $update: Function;
    vid: number;
    static Target: View | undefined;
    constructor();
    render(modal: _Modal | primitiveValue, container: HTMLElement | string): void;
    getLayout(): ASTNode;
    bindModal(modal: _Modal): void;
    resolveDirectives(directives: any, renderStr: string): void;
    d_for(options: any): void;
}
