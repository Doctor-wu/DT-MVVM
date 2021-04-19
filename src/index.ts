import {getDOM, isPrimitiveValue} from "./utils/util";
import {NODE_TYPE} from "./constant";
import {ASTNode, createLayout} from "./createLayout";
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
                    children: [
                        {
                            type: NODE_TYPE.Element,
                            tagName: 'p',
                            children: [
                                {
                                    type: NODE_TYPE.Text,
                                    content: "I like read {%books[0].name%} and {% books[1].name %}",
                                }
                            ],
                            config: {
                                directives: {
                                    for: {
                                        expr: 'books',
                                        item: 'item',
                                        index: 'index'
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

    resolveDirectives(directives, renderStr:string){
        if(!directives) return;
        console.log(renderStr)
        Object.keys(directives).forEach(key=>{
            const resolver = this[`d_${key}`];
            if(resolver == undefined) return;
            resolver.call(this, directives[key])
        })
    }

    d_for(options){
        console.log(options)
    }
}
