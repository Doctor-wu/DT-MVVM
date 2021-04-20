import {deepClone, getDOM, isPrimitiveValue} from "./utils/util";
import {NODE_TYPE} from "./constant";
import {ASTNode, createLayout, genCode} from "./createLayout";
import type {Modal as _Modal} from "./Modal";
import {primitiveValue} from "./common/types";

export const Modal = require("./Modal").Modal;
let vid = 0;

export class View {
    public rootElement!: HTMLElement | null;
    public $el!: HTMLElement;
    public $modal!: _Modal;
    public modalSet: Set<_Modal> = new Set;
    public $update!: Function;
    public vid: number;

    static Target: View | undefined;

    constructor() {
        this.vid = vid++;
    }

    render(modal: _Modal | primitiveValue, container: HTMLElement | string) {
        // 如果modal是原始值，则用Modal包装一层
        if (isPrimitiveValue(modal)) modal = new Modal({default: modal});
        // 给当前的View实例绑定一个数据对象
        this.bindModal(<_Modal>modal);

        // 解析出View挂载的容器
        this.rootElement = getDOM(container);
        if (this.rootElement === null) return;
        // 构建layout，数据绑定在模板中
        this.$el = createLayout.call(this, this.getLayout(), this.$modal);
        this.rootElement.appendChild(this.$el);
    }

    getLayout(): ASTNode {
        return {
            type: NODE_TYPE.Element,
            tagName: 'div',
            config: {
                style: {
                    color: 'red'
                }
            },
            children: [
                {
                    type: NODE_TYPE.Text,
                    content: "Hello {%guest%}, my name is {%myName%}, now is {%date%}"
                },
                {
                    type: NODE_TYPE.Element,
                    tagName: 'div',
                    config: {
                        directives: {
                            for: {
                                expr: 'books',
                                alias: 'item',
                                index: "index"
                            },
                        }
                    },
                    children: [
                        {
                            type: NODE_TYPE.Element,
                            tagName: 'p',
                            children: [
                                {
                                    type: NODE_TYPE.Element,
                                    tagName: 'h3',
                                    children: [
                                        {
                                            type: NODE_TYPE.Text,
                                            content: "{%item.name%} like me too {%index + 1%}",
                                        },
                                    ]
                                },
                                {
                                    type: NODE_TYPE.Text,
                                    content: "I like read {%item.name%} {%index%}",
                                },
                            ],
                            config: {
                                directives: {
                                    bind: {
                                        expr: 'style',
                                        value: "{color: item.color}"
                                    }
                                }
                            },
                        }
                    ]
                },
                {
                    type: NODE_TYPE.Element,
                    tagName: 'div',
                    children: [
                        {
                            type: NODE_TYPE.Text,
                            content: "{%myName%} : "
                        },
                        {
                            type: NODE_TYPE.Element,
                            tagName: 'input',
                            config: {
                                bind: {
                                    expr: 'value',
                                    value: "{%myName%}"
                                }
                            }
                        }
                    ]
                },
                {
                    type: NODE_TYPE.Element,
                    tagName: 'div',
                    config: {
                        style: {
                            color: 'blue'
                        }
                    },
                    children: [
                        {
                            type: NODE_TYPE.Text,
                            content: "Hello "
                        },
                        {
                            type: NODE_TYPE.Text,
                            content: "{%guest%}, "
                        },
                        {
                            type: NODE_TYPE.Text,
                            content: "my name is"
                        },
                        {
                            type: NODE_TYPE.Text,
                            content: " {%myName%}"
                        },
                    ]
                },
            ]
        }
    }

    bindModal(modal: _Modal) {
        this.$modal = modal;
    }


    resolveDirectives(node: ASTNode): string | undefined {
        const directives = node?.config?.directives || null;
        if (!directives) return undefined;
        let content = "";
        Object.keys(directives).forEach(key => {
            const resolver = this[`d_${key}`];
            if (resolver == undefined) return;
            content += resolver.call(this, node, content)
        });
        return content;
    }

    d_for(node: ASTNode): string {
        const {
            directives: {for: config},
        } = <any>node.config!;
        const nConfig = deepClone(node.config!);
        delete (nConfig.directives as any).for;
        return `_l("${config.expr}", function(${config.alias}, ${config.index}){
        this["${config.alias}"] = ${config.alias};
        ${config.index ? `this["${config.index}"] = ${config.index};` : ''}
        return _e("${node.tagName}", _a(${JSON.stringify(nConfig)}), ${node.children ? genCode.call(this, node.children) : null});
        delete this["${config.expr}"];
        delete this["${config.index}"];
        }),`;
    }
}
