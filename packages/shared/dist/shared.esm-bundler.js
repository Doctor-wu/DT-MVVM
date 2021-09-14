var isObject = function (value) { return typeof value === 'object' && value !== null; };
var extend = Object.assign;
var isArray = Array.isArray;
function isFunction(value) {
    return typeof value === 'function';
}
var isNumber = function (value) { return typeof value === 'number'; };
var isString = function (value) { return typeof value === 'string'; };
var isIntegerKey = function (key) {
    if (typeof key === 'symbol')
        return false;
    return String(parseInt(key + '')) === key;
};
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = function (target, key) { return hasOwnProperty.call(target, key); };
var hasChanged = function (oldValue, value) { return oldValue !== value; };
var Shared = {
    isObject: isObject,
};

export { Shared, extend, hasChanged, hasOwn, isArray, isFunction, isIntegerKey, isNumber, isObject, isString };
//# sourceMappingURL=shared.esm-bundler.js.map
