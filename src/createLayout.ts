import {NODE_TYPE} from "./constant";
import {primitiveValue} from "./common/types";
import {View} from "./index";
import {Modal} from "./Modal";

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
    _DForData?: any;
}

export function createLayout(this: View, node: ASTNode, modal): HTMLElement {
    const code = genCode.call(this,[node]);
    console.log(modal);
    const render = new Function('modal', `with(modal){return ${code}}`);
    this.$update = () => {
        const dom = genHTML.call(this, render(modal)).childNodes[0];
        this.$el?.parentNode?.replaceChild(dom, this.$el);
        this.$el = <HTMLElement>dom;
    }
    console.log(render);
    View.Target = this;
    const ast = render(modal);
    View.Target = undefined;
    console.log(ast);
    const dom = genHTML.call(this, ast);
    return <HTMLElement>dom.childNodes[0];
}


function resolveStyle(dom, style: object = {}) {
    Object.keys(style || {}).forEach(key => {
        dom.style[key] = style[key];
    });
}

function resolveBind(dom, bind: object = {}, modal: Modal) {
    Object.keys(bind || {}).forEach(key => {
        dom[key] = modal.parseModal(bind[key]);
    });
}


function genHTML(this: View, VNodes): DocumentFragment {
    const fragment = document.createDocumentFragment();
    VNodes.forEach(node => {
        if (node.type === "element") {
            const dom = document.createElement(node.tagName);
            resolveBind(dom, node?.config?.bind, this.$modal);
            resolveStyle(dom, node?.config?.style);
            if (node.children) dom.appendChild(genHTML.call(this, node.children));
            fragment.append(dom);
        }
        if (node.type === 'text') {
            fragment.append(document.createTextNode(node.content));
        }
    });

    return fragment;
}


function genCode(this: View, nodes: ASTNode[]) {
    let content = "";
    nodes.forEach(node => {
        if(this.resolveDirectives(node)) return;
        if (node.type === NODE_TYPE.Element) {
            content += `_e("${node.tagName}",${node.config ? `_a(${JSON.stringify(node.config)})` : null},${node.children ? genCode.call(this, node.children) : null}),`;
        }
        if (node.type === NODE_TYPE.Text) {
            content += `_t("${node.content}"),`;
        }
    })
    return `_f(${content})`;
}
