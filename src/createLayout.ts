import {NODE_TYPE} from "./constant";
import {primitiveValue} from "./common/types";
import {View} from "./index";

export interface VNode {
    type: typeof NODE_TYPE[keyof typeof NODE_TYPE];
    tagName?: string;
    attrs?: object | null;
    children?: VNode[];
    bind?: {};
    content?: Omit<primitiveValue, 'Symbol'>;
}

export function createLayout(this: View, node: VNode, modal): HTMLElement {
    const code = genCode([node]);
    console.log(modal);
    const render = new Function('modal', `with(modal){return ${code}}`);
    this.$update = () => {
        const dom = genHTML(render(modal)).childNodes[0];
        this.$el?.parentNode?.replaceChild(dom, this.$el);
        this.$el = <HTMLElement>dom;
    }
    console.log(render);
    View.Target = this;
    const ast = render(modal);
    View.Target = undefined;
    console.log(ast);
    const dom = genHTML(ast);
    console.dir(dom.childNodes[0]);
    return <HTMLElement>dom.childNodes[0];
}


function genHTML(ast): DocumentFragment {
    const fragment = document.createDocumentFragment();
    ast.forEach(node => {
        if (node.type === "element") {
            const dom = document.createElement(node.tagName);
            Object.assign(dom, node.attrs || {});
            const {style} = node.attrs || {};
            Object.keys(style || {}).forEach(key => {
                dom.style[key] = node.attrs.style[key];
            });
            if (node.children) dom.appendChild(genHTML(node.children));
            fragment.append(dom);
        }
        if (node.type === 'text') {
            fragment.append(document.createTextNode(node.content));
        }
    });

    return fragment;
}


function genCode(nodes: VNode[]) {
    let content = "";
    nodes.forEach(node => {
        if (node.type === NODE_TYPE.Element) {
            content += `_e("${node.tagName}",_a(${JSON.stringify(node.attrs)}),${node.children ? genCode(node.children) : null}),`;
        }
        if (node.type === NODE_TYPE.Text) {
            content += `_t("${node.content}"),`;
        }
    })
    return `_f(${content})`;
}
