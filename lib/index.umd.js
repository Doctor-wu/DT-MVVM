(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('core-js/modules/es6.set.js'), require('core-js/modules/es6.string.iterator.js'), require('core-js/modules/es6.object.to-string.js'), require('core-js/modules/es6.array.iterator.js'), require('core-js/modules/web.dom.iterable.js'), require('core-js/modules/es6.object.keys.js'), require('core-js/modules/es6.regexp.to-string.js'), require('core-js/modules/es6.object.get-prototype-of.js'), require('core-js/modules/es6.function.name.js'), require('core-js/modules/es6.regexp.match.js'), require('core-js/modules/es6.regexp.replace.js'), require('core-js/modules/es7.array.includes.js'), require('core-js/modules/es6.symbol.js'), require('core-js/modules/es6.reflect.get.js'), require('core-js/modules/es6.reflect.set.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'core-js/modules/es6.set.js', 'core-js/modules/es6.string.iterator.js', 'core-js/modules/es6.object.to-string.js', 'core-js/modules/es6.array.iterator.js', 'core-js/modules/web.dom.iterable.js', 'core-js/modules/es6.object.keys.js', 'core-js/modules/es6.regexp.to-string.js', 'core-js/modules/es6.object.get-prototype-of.js', 'core-js/modules/es6.function.name.js', 'core-js/modules/es6.regexp.match.js', 'core-js/modules/es6.regexp.replace.js', 'core-js/modules/es7.array.includes.js', 'core-js/modules/es6.symbol.js', 'core-js/modules/es6.reflect.get.js', 'core-js/modules/es6.reflect.set.js'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Mvvm = {}));
}(this, (function (exports) { 'use strict';

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

	var _typeof = unwrapExports(_typeof_1);

	var class2type = {};
	var toString = class2type.toString; //Object.prototype.toString

	var hasOwn = class2type.hasOwnProperty; //Object.prototype.hasOwnProperty

	var fnToString = hasOwn.toString; //Function.prototype.toString

	fnToString.call(Object); //"function Object() { [native code] }"
	// 建立数据类型检测的映射表 [object Xxx]:xxx

	["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol", "BigInt", "GeneratorFunction"].forEach(function (name) {
	  class2type["[object " + name + "]"] = name.toLowerCase();
	});
	/**
	 * toType：数据类型检测的公共方法
	 * @author Doctorwu
	 * @date 2020-09-13
	 * @param {any} obj
	 * @returns {any}
	 */

	function toType(obj) {
	  // null/undefined
	  if (obj == null) {
	    return obj + "";
	  } // 基本数据类型检测基于typeof
	  // 引用数据类型检测基于Object.prototype.toString.call


	  return _typeof(obj) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : _typeof(obj);
	}
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
	/**
	 * 深克隆
	 * @author Doctorwu
	 * @date 2020-09-15
	 * @param {object} obj
	 * @returns {any}
	 */

	function deepClone(obj) {
	  if (obj == null) return obj;
	  var constructor = obj.constructor;
	  if (_typeof(obj) !== "object") return obj;

	  if (/^RegExp|Date$/i.test(constructor.name)) {
	    // @ts-ignore
	    return new constructor(obj);
	  } // @ts-ignore


	  var clone = new constructor();

	  for (var key in obj) {
	    // eslint-disable-next-line no-prototype-builtins
	    if (!obj.hasOwnProperty(key)) break; // @ts-ignore

	    clone[key] = deepClone(obj[key]);
	  }

	  return clone;
	}
	function getDOM(expr) {
	  if (expr instanceof HTMLElement) return expr;
	  return document.querySelector(expr);
	}
	function isPrimitiveValue(value) {
	  return ["string", "number", "boolean", "symbol", "bigint", "null", "undefined"].includes(toType(value));
	}

	var NODE_TYPE = {
	  'Element': Symbol('Element'),
	  'Text': Symbol('Text')
	};

	function omitWrap(str) {
	  if (!str) return "";
	  return str.replace(/\{%([^%}]+)%\}/g, function () {
	    var args = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      args[_i] = arguments[_i];
	    }

	    return "\" + _s('" + args[1] + "') + \"";
	  });
	}

	function createLayout(node, modal) {
	  var _this = this;

	  var code = genCode.call(this, [node]);
	  console.log(modal);
	  var render = new Function('modal', "with(modal){return " + code + "}");

	  this.$update = function () {
	    var _a, _b;

	    var dom = genHTML.call(_this, render(modal)).childNodes[0];
	    (_b = (_a = _this.$el) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.replaceChild(dom, _this.$el);
	    _this.$el = dom;
	  };

	  console.log(render);
	  View.Target = this;
	  var ast = render(modal);
	  View.Target = undefined;
	  console.log(ast);
	  var dom = genHTML.call(this, ast);
	  return dom.childNodes[0];
	}

	function resolveStyle(dom, style) {
	  if (style === void 0) {
	    style = {};
	  }

	  Object.keys(style || {}).forEach(function (key) {
	    dom.style[key] = style[key];
	  });
	}

	function resolveBind(dom, bind, modal) {
	  if (bind === void 0) {
	    bind = {};
	  }

	  Object.keys(bind || {}).forEach(function (key) {
	    dom[key] = modal.parseModal(bind[key]);
	  });
	}

	function genHTML(VNodes) {
	  var _this = this;

	  var fragment = document.createDocumentFragment();
	  VNodes.forEach(function (node) {
	    var _a, _b;

	    if (Array.isArray(node)) {
	      node.forEach(function (child) {
	        var _a, _b;

	        if (child.type === "element") {
	          var dom = document.createElement(child.tagName);
	          resolveBind(dom, (_a = child === null || child === void 0 ? void 0 : child.config) === null || _a === void 0 ? void 0 : _a.bind, _this.$modal);
	          resolveStyle(dom, (_b = child === null || child === void 0 ? void 0 : child.config) === null || _b === void 0 ? void 0 : _b.style);
	          if (child.children) dom.appendChild(genHTML.call(_this, child.children));
	          fragment.append(dom);
	        }

	        if (child.type === 'text') {
	          fragment.append(document.createTextNode(child.content));
	        }
	      });
	    } else {
	      if (node.type === "element") {
	        var dom = document.createElement(node.tagName);
	        resolveBind(dom, (_a = node === null || node === void 0 ? void 0 : node.config) === null || _a === void 0 ? void 0 : _a.bind, _this.$modal);
	        resolveStyle(dom, (_b = node === null || node === void 0 ? void 0 : node.config) === null || _b === void 0 ? void 0 : _b.style);
	        if (node.children) dom.appendChild(genHTML.call(_this, node.children));
	        fragment.append(dom);
	      }

	      if (node.type === 'text') {
	        fragment.append(document.createTextNode(node.content));
	      }
	    }
	  });
	  return fragment;
	}

	function genCode(nodes, modal) {
	  var _this = this;

	  var content = "";
	  nodes.forEach(function (node) {
	    var dContent = "";
	    dContent = _this.resolveDirectives(node);

	    if (dContent) {
	      content += dContent;
	      return;
	    }

	    if (node.type === NODE_TYPE.Element) {
	      content += "_e(\"" + node.tagName + "\"," + (node.config ? "_a(" + JSON.stringify(node.config) + ")" : null) + "," + (node.children ? genCode.call(_this, node.children) : null) + "),";
	    }

	    if (node.type === NODE_TYPE.Text) {
	      content += "_t(\"" + omitWrap(node.content) + "\"" + (modal ? ",\"" + modal + "\"" : "") + "),";
	    }
	  });
	  return "_f(" + content + ")";
	}

	var Modal = require("./Modal").Modal;
	var vid = 0;

	var View =
	/** @class */
	function () {
	  function View() {
	    this.modalSet = new Set();
	    this.vid = vid++;
	  }

	  View.prototype.render = function (modal, container) {
	    // 如果modal是原始值，则用Modal包装一层
	    if (isPrimitiveValue(modal)) modal = new Modal({
	      default: modal
	    }); // 给当前的View实例绑定一个数据对象

	    this.bindModal(modal); // 解析出View挂载的容器

	    this.rootElement = getDOM(container);
	    if (this.rootElement === null) return; // 构建layout，数据绑定在模板中

	    this.$el = createLayout.call(this, this.getLayout(), this.$modal);
	    this.rootElement.appendChild(this.$el);
	  };

	  View.prototype.getLayout = function () {
	    return {
	      type: NODE_TYPE.Element,
	      tagName: 'div',
	      config: {
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
	          type: NODE_TYPE.Element,
	          tagName: 'p',
	          children: [{
	            type: NODE_TYPE.Text,
	            content: "I like read {%item.name%}"
	          }],
	          config: {
	            directives: {
	              for: {
	                expr: 'books',
	                alias: 'item'
	              },
	              bind: {
	                expr: 'style',
	                value: "{%obj%}"
	              }
	            }
	          }
	        }]
	      }, {
	        type: NODE_TYPE.Element,
	        tagName: 'div',
	        children: [{
	          type: NODE_TYPE.Text,
	          content: "{%myName%} : "
	        }, {
	          type: NODE_TYPE.Element,
	          tagName: 'input',
	          config: {
	            bind: {
	              value: "{%myName%}"
	            }
	          }
	        }]
	      }, {
	        type: NODE_TYPE.Element,
	        tagName: 'div',
	        config: {
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

	  View.prototype.bindModal = function (modal) {
	    this.$modal = modal;
	  };

	  View.prototype.resolveDirectives = function (node) {
	    var _this = this;

	    var _a;

	    var directives = ((_a = node === null || node === void 0 ? void 0 : node.config) === null || _a === void 0 ? void 0 : _a.directives) || null;
	    if (!directives) return undefined;
	    var content = "";
	    Object.keys(directives).forEach(function (key) {
	      var resolver = _this["d_" + key];
	      if (resolver == undefined) return;
	      content += resolver.call(_this, node, content);
	    });
	    return content;
	  };

	  View.prototype.d_for = function (node) {
	    var config = node.config.directives.for;
	    var nConfig = deepClone(node.config);
	    delete nConfig.directives.for;
	    return "_l(\"" + config.expr + "\", function(" + config.alias + "){\n        this[\"" + config.alias + "\"] = " + config.alias + ";\n        return _e(\"" + node.tagName + "\", _a(" + JSON.stringify(nConfig) + "), " + (node.children ? genCode.call(this, node.children) : null) + ");\n        delete this[\"" + config.expr + "\"];\n        }),";
	  };

	  return View;
	}();

	exports.Modal = Modal;
	exports.View = View;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
