/**
 * 防抖函数
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} func
 * @param {any} delay=500
 * @param {any} immediately=false
 * @returns {any}
 */
export function debounce(func, delay = 500, immediately = false): Function {
    let timer;
    if (!immediately) {
        return function (this: any, ...args) {
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = null;
            }, delay);
        };
    } else {
        return function (this: any, ...args) {
            timer && clearTimeout(timer);
            !timer && func.apply(this, args);
            timer = setTimeout(() => {
                timer = null;
            }, delay);
        };
    }
}

/**
 * 节流函数
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} func
 * @param {any} delay=300
 * @returns {any}
 */
export function throttle(func, delay = 300) {
    let timer: any = undefined,
        previous = 0;
    return function anonymous(this: any, ...params) {
        let now = Date.now(),
            remaining = delay - (now - previous);
        if (remaining <= 0) {
            clearTimeout(timer);
            timer = undefined;
            previous = Date.now();
            func.apply(this, params);
        } else if (!timer) {
            timer = setTimeout(() => {
                timer = undefined;
                previous = Date.now();
                func.apply(this, params);
            }, remaining);
        }
    };
}

const class2type = {};
const toString = class2type.toString; //Object.prototype.toString
const hasOwn = class2type.hasOwnProperty; //Object.prototype.hasOwnProperty
const fnToString = hasOwn.toString; //Function.prototype.toString
const ObjectFunctionString = fnToString.call(Object); //"function Object() { [native code] }"
const getProto = Object.getPrototypeOf; //获取对象原型链__proto__指向的原型

// 建立数据类型检测的映射表 [object Xxx]:xxx
[
    "Boolean",
    "Number",
    "String",
    "Function",
    "Array",
    "Date",
    "RegExp",
    "Object",
    "Error",
    "Symbol",
    "BigInt",
    "GeneratorFunction",
].forEach((name) => {
    class2type[`[object ${name}]`] = name.toLowerCase();
});

/**
 * toType：数据类型检测的公共方法
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export function toType(obj) {
    // null/undefined
    if (obj == null) {
        return obj + "";
    }
    // 基本数据类型检测基于typeof
    // 引用数据类型检测基于Object.prototype.toString.call
    return typeof obj === "object" || typeof obj === "function"
        ? class2type[toString.call(obj)] || "object"
        : typeof obj;
}

/**
 * 检测是否为函数
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export function isFunction(obj) {
    // i.e., `typeof document.createElement( "object" ) === "function"`
    return typeof obj === "function" && typeof obj.nodeType !== "number";
}

/**
 * 检测是否为window对象
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export function isWindow(obj) {
    // window.window===window
    return obj != null && obj === obj.window;
}

/**
 * 检测是否为数组或者类数组
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export function isArrayLike(obj) {
    // length:对象的length属性值或者是false
    // type:获取检测值的数据类型
    var length = !!obj && "length" in obj && obj.length,
        type = toType(obj);

    // 函数和window一定不是数据或者类数组（但是他们确实有length属性）
    if (isFunction(obj) || isWindow(obj)) {
        return false;
    }

    // type === "array"：数组
    // length === 0：我们认为其是一空的类数组集合
    // (length - 1) in obj：对于非空集合，我们认为只要最大索引在对象中，则证明索引是逐级递增的（不准确）
    return (
        type === "array" ||
        length === 0 ||
        (typeof length === "number" && length > 0 && length - 1 in obj)
    );
}

/**
 * 验证是否为空对象：主要是看当前对象中是否存在私有属性
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (!obj.hasOwnProperty(name)) break;
        return false;
    }
    return true;
}

/**
 * 是否为纯粹的对象
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export function isPlainObject(obj) {
    var proto, Ctor;

    // 基于toString.call返回结果不是[object Object]则一定不是纯粹的对象
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }

    // 获取当前对象所属类的原型
    proto = getProto(obj);

    // Object.create(null)：创建一个空对象，但是没有__proto__
    if (!proto) return true;

    // Ctor：获取当前对象所属类的constructor
    // 纯粹对象的特点：直属类的原型一定是Object.prototype（DOM元素对象/自定义的实例对象...都不是）
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return (
        typeof Ctor === "function" &&
        fnToString.call(Ctor) === ObjectFunctionString
    );
}

/**
 * 断言函数
 * @author Doctorwu
 * @date 2020-09-15
 * @param {any} exp
 * @param {string} msg
 * @returns {never|void}
 */
export function assert(exp: any, msg: string): never | void {
    if (!exp) {
        throw new Error(msg);
    }
}

assert(true, '1323')

/**
 * 深克隆
 * @author Doctorwu
 * @date 2020-09-15
 * @param {object} obj
 * @returns {any}
 */
export function deepClone<T extends object | null>(obj: T): T {
    if (obj == null) return obj;
    const constructor = obj.constructor;
    if (typeof obj !== "object") return obj;
    if (/^RegExp|Date$/i.test(constructor.name)) { // @ts-ignore
        return new constructor(obj);
    }
    // @ts-ignore
    let clone = new constructor();
    for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (!obj.hasOwnProperty(key)) break;
        // @ts-ignore
        clone[key] = deepClone(obj[key]);
    }
    return clone;
}

/**
 * 格式化时间字符串
 * @author Doctorwu
 * @date 2020-09-15
 * @returns {any}
 * @param timeStr
 * @param template
 */
export function formatTime(timeStr: string, template = `{0}年{1}月{2}日{3}时{4}分{5}秒`): string {
    // 首先获取时间字符串中的年月日等信息
    const timeArr = timeStr.match(/\d+/g) || [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    template = template.replace(/{(\d)}/g, (...[, $1]) => {
        let time = timeArr[$1] || "00";
        time = time.length < 2 ? "0" + time : time;
        return time;
    });
    return template;
}

export function getDOM(expr: HTMLElement | string): HTMLElement | null {
    if (expr instanceof HTMLElement) return expr;
    return document.querySelector(expr);
}

export function isPrimitiveValue(value: any): Boolean {
    return [
        "string",
        "number",
        "boolean",
        "symbol",
        "bigint",
        "null",
        "undefined"
    ].includes(toType(value));
}
