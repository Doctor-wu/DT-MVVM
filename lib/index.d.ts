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
    resolveDirectives(node: ASTNode): string | undefined;
    d_for(node: ASTNode): string;
}
