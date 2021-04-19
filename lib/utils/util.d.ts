/**
 * 防抖函数
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} func
 * @param {any} delay=500
 * @param {any} immediately=false
 * @returns {any}
 */
export declare function debounce(func: any, delay?: number, immediately?: boolean): Function;
/**
 * 节流函数
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} func
 * @param {any} delay=300
 * @returns {any}
 */
export declare function throttle(func: any, delay?: number): (this: any, ...params: any[]) => void;
/**
 * toType：数据类型检测的公共方法
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export declare function toType(obj: any): any;
/**
 * 检测是否为函数
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export declare function isFunction(obj: any): boolean;
/**
 * 检测是否为window对象
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export declare function isWindow(obj: any): boolean;
/**
 * 检测是否为数组或者类数组
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export declare function isArrayLike(obj: any): boolean;
/**
 * 验证是否为空对象：主要是看当前对象中是否存在私有属性
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export declare function isEmptyObject(obj: any): boolean;
/**
 * 是否为纯粹的对象
 * @author Doctorwu
 * @date 2020-09-13
 * @param {any} obj
 * @returns {any}
 */
export declare function isPlainObject(obj: any): boolean;
/**
 * 断言函数
 * @author Doctorwu
 * @date 2020-09-15
 * @param {any} exp
 * @param {string} msg
 * @returns {never|void}
 */
export declare function assert(exp: any, msg: string): never | void;
/**
 * 深克隆
 * @author Doctorwu
 * @date 2020-09-15
 * @param {object} obj
 * @returns {any}
 */
export declare function deepClone<T extends object | null>(obj: T): T;
/**
 * 格式化时间字符串
 * @author Doctorwu
 * @date 2020-09-15
 * @returns {any}
 * @param timeStr
 * @param template
 */
export declare function formatTime(timeStr: string, template?: string): string;
export declare function getDOM(expr: HTMLElement | string): HTMLElement | null;
export declare function isPrimitiveValue(value: any): Boolean;
