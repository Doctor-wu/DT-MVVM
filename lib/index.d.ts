import { VNode } from "./createLayout";
import Modal from "./Modal";
export declare class View {
    rootElement: HTMLElement | null;
    $el: HTMLElement;
    $modal: Modal;
    $update: Function;
    vid: number;
    static Target: View | undefined;
    constructor();
    render(modal: Modal, container: HTMLElement | string): void;
    layout(): VNode;
}
