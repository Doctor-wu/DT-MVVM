import {getDOM} from "./utils/util";
import {NODE_TYPE} from "./constant";
import {createLayout, VNode} from "./createLayout";
import Modal from "./Modal";


let vid = 0;

export class View {
    public rootElement!: HTMLElement | null;
    public $el!: HTMLElement;
    public $modal!: Modal;
    public $update!: Function;
    public vid: number;

    static Target: View | undefined;

    constructor() {
        this.vid = vid++;
    }

    render(modal: Modal, container: HTMLElement | string) {
        this.$modal = modal;
        this.rootElement = getDOM(container);
        if (this.rootElement === null) return;
        this.$el = createLayout.call(this, this.layout(), this.$modal);
        this.rootElement.appendChild(this.$el);
    }

    layout(): VNode {
        return {
            type: NODE_TYPE.Element,
            tagName: 'div',
            attrs: {
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
                            type: NODE_TYPE.Text,
                            content: "{%myName%} : "
                        },
                        {
                            type: NODE_TYPE.Element,
                            tagName: 'input',
                            attrs: {
                                bind: {
                                    value: "{%myName%}"
                                },
                            }
                        }
                    ]
                },
                {
                    type: NODE_TYPE.Element,
                    tagName: 'div',
                    attrs: {
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
}

