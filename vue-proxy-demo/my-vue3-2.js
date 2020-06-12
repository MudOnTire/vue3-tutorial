/**
 * 使用proxy进行代理监听
 * @param {any} target 被代理的对象
 */
function reactive(target) {
  return new Proxy(target, {
    get: function (target, prop, receiver) {
      // 引用对象属性触发依赖收集
      track(target, prop);
      return Reflect.get(target, prop, receiver);
    },
  });
}

/**
 *
 * @param {any} target 被观察对象
 * @param {any} prop 被观察对象的被引用属性
 * 依赖对象结构如下:
 * {
 *   target1: {
 *     prop1:[effects...],
 *     prop2:[effects...]
 *   }
 *   target2: {
 *     prop1:[effects...],
 *     prop2:[effects...]
 *   }
 * }
 *
 * 所有的effects使用stack结构记录:
 */
const effectStack = [];
function track(target, prop) {}

/**
 *
 * @param {Function} fn 副作用回调
 * @param {Object} options 选项
 */
function effect(callback, options = {}) {
  const { computed, lazy } = options;
  // 包装一个effect对象
  const wrappedEffect = {
    run() {
      if (effectStack.indexOf(this) < 0) {
        try {
          effectStack.push(this);
          return callback();
        } finally {
          effectStack.pop();
        }
      }
    },
    deps: [],
    computed,
    lazy,
  };
  if(!wrappedEffect.lazy) wrappedEffect.run();
  return wrappedEffect;
}

/**
 * 计算属性，是一种特殊的effect
 * @param {Function} fn
 */
function computed(fn) {}
