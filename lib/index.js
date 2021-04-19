'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('core-js/modules/es6.object.to-string.js');
require('core-js/modules/es6.regexp.to-string.js');
require('core-js/modules/es6.object.get-prototype-of.js');
require('core-js/modules/es6.function.name.js');
require('core-js/modules/es6.regexp.match.js');
require('core-js/modules/es6.regexp.replace.js');
require('core-js/modules/es7.array.includes.js');
require('core-js/modules/es6.symbol.js');
require('core-js/modules/es6.object.assign.js');
require('core-js/modules/es6.object.keys.js');

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(_typeof_1);

var class2type = {};

var hasOwn = class2type.hasOwnProperty; //Object.prototype.hasOwnProperty

var fnToString = hasOwn.toString; //Function.prototype.toString

fnToString.call(Object); //"function Object() { [native code] }"
// 建立数据类型检测的映射表 [object Xxx]:xxx

["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol", "BigInt", "GeneratorFunction"].forEach(function (name) {
  class2type["[object " + name + "]"] = name.toLowerCase();
});
/**
 * 断言函数
 * @author Doctorwu
 * @date 2020-09-15
 * @param {any} exp
 * @param {string} msg
 * @returns {never|void}
 */

function assert(exp, msg) {
  if (!exp) {
    throw new Error(msg);
  }
}
assert(true, '1323');
function getDOM(expr) {
  if (expr instanceof HTMLElement) return expr;
  return document.querySelector(expr);
}

var NODE_TYPE = {
  'Element': Symbol('Element'),
  'Text': Symbol('Text')
};

function createLayout(node, modal) {
  var _this = this;

  var code = genCode([node]);
  console.log(modal);
  var render = new Function('modal', "with(modal){return " + code + "}");

  this.$update = function () {
    var _a, _b;

    var dom = genHTML(render(modal)).childNodes[0];
    (_b = (_a = _this.$el) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.replaceChild(dom, _this.$el);
    _this.$el = dom;
  };

  console.log(render);
  View.Target = this;
  var ast = render(modal);
  View.Target = undefined;
  console.log(ast);
  var dom = genHTML(ast);
  console.dir(dom.childNodes[0]);
  return dom.childNodes[0];
}

function genHTML(ast) {
  var fragment = document.createDocumentFragment();
  ast.forEach(function (node) {
    if (node.type === "element") {
      var dom_1 = document.createElement(node.tagName);
      Object.assign(dom_1, node.attrs || {});
      var style = (node.attrs || {}).style;
      Object.keys(style || {}).forEach(function (key) {
        dom_1.style[key] = node.attrs.style[key];
      });
      if (node.children) dom_1.appendChild(genHTML(node.children));
      fragment.append(dom_1);
    }

    if (node.type === 'text') {
      fragment.append(document.createTextNode(node.content));
    }
  });
  return fragment;
}

function genCode(nodes) {
  var content = "";
  nodes.forEach(function (node) {
    if (node.type === NODE_TYPE.Element) {
      content += "_e(\"" + node.tagName + "\",_a(" + JSON.stringify(node.attrs) + ")," + (node.children ? genCode(node.children) : null) + "),";
    }

    if (node.type === NODE_TYPE.Text) {
      content += "_t(\"" + node.content + "\"),";
    }
  });
  return "_f(" + content + ")";
}

var vid = 0;

var View =
/** @class */
function () {
  function View() {
    this.vid = vid++;
  }

  View.prototype.render = function (modal, container) {
    this.$modal = modal;
    this.rootElement = getDOM(container);
    if (this.rootElement === null) return;
    this.$el = createLayout.call(this, this.layout(), this.$modal);
    this.rootElement.appendChild(this.$el);
  };

  View.prototype.layout = function () {
    return {
      type: NODE_TYPE.Element,
      tagName: 'div',
      attrs: {
        style: {
          color: 'red'
        }
      },
      children: [{
        type: NODE_TYPE.Text,
        content: "Hello {%guest%}, my name is {%myName%}, now is {%date%}"
      }, {
        type: NODE_TYPE.Element,
        tagName: 'div',
        children: [{
          type: NODE_TYPE.Text,
          content: "{%myName%} : "
        }, {
          type: NODE_TYPE.Element,
          tagName: 'input',
          attrs: {
            bind: {
              value: "{%myName%}"
            }
          }
        }]
      }, {
        type: NODE_TYPE.Element,
        tagName: 'div',
        attrs: {
          style: {
            color: 'blue'
          }
        },
        children: [{
          type: NODE_TYPE.Text,
          content: "Hello "
        }, {
          type: NODE_TYPE.Text,
          content: "{%guest%}, "
        }, {
          type: NODE_TYPE.Text,
          content: "my name is"
        }, {
          type: NODE_TYPE.Text,
          content: " {%myName%}"
        }]
      }]
    };
  };

  return View;
}();

exports.View = View;
//# sourceMappingURL=index.js.map
