/**
  * 使用Proxy实现数据监听
  * @param {any} target 被监听的对象
  */
function reactive(target) {
  // 创建代理对象
  const observed = new Proxy(target, {
    get(target, key) {
      const val = Reflect.get(target, key);
      // 依赖收集
      track(target, key);
      // 如果值为对象则递归处理
      return typeof val === "object" ? reactive(val) : val;
    },
    set(target, key, val) {
      const info = { oldValue: target[key], newValue: val };
      Reflect.set(target, key, val);
      // 响应式去通知变化
      trigger(target, key, info);
    },
  });

  return observed;
}

/**
 * 计算属性，是特殊的effect
 * @param {Function} fn 回调方法
 */
function computed(fn) {
  // 特殊的effect
  const runner = effect(fn, { computed: true, lazy: true });
  return {
    effect: runner,
    get value() {
      return runner();
    },
  };
}

// 存储effect
let effectStack = [];

/**
 * 副作用
 * @param {Function} fn 
 * @param {Object} options 
 */
function effect(fn, options = {}) {
  // 依赖函数
  let e = createReactiveEffect(fn, options);
  // lazy是computed配置的
  if (!options.lazy) {
    // 不是懒执行
    e();
  }
  return e;
}

function createReactiveEffect(fn, options = {}) {
  // 构造固定格式的effect
  const effect = function (...args) {
    return run(effect, fn, args);
  };
  // effect的配置
  effect.deps = [];
  effect.computed = options.computed;
  effect.lazy = options.lazy;
  return effect;
}

function run(effect, fn, args) {
  // 执行effect
  // 取出effect，执行
  if (effectStack.indexOf(effect) < 0) {
    try {
      effectStack.push(effect);
      return fn(...args);
    } finally {
      // effect执行完毕
      effectStack.pop();
    }
  }
}

/**
 * 依赖收集
 */
let targetMap = new WeakMap();
function track(target, key) {
  // 收集依赖
  const effect = effectStack[effectStack.length - 1];
  if (effect) {
    let depMap = targetMap.get(target);
    if (depMap === undefined) {
      depMap = new Map();
      targetMap.set(target, depMap);
    }
    let dep = depMap.get(key);
    if (dep === undefined) {
      dep = new Set();
      depMap.set(key, dep);
    }

    // 容错
    if (!dep.has(effect)) {
      // 新增依赖
      //
      dep.add(effect);
      effect.deps.push(dep);
    }
  }
}

/**
 * 通知更新
 */
function trigger(target, key, info) {
  // 数据变化后，通知更新
  // 1. 找到依赖
  const depMap = targetMap.get(target);
  if (depMap === undefined) return;
  // 优先级普通effect > computed，因为computed可能会依赖普通的effects
  const effects = new Set();
  const computedRunners = new Set();
  if (key) {
    let deps = depMap.get(key);
    deps.forEach((effect) => {
      if (effect.computed) {
        computedRunners.add(effect);
      } else {
        effects.add(effect);
      }
    });
    effects.forEach((effect) => effect());
    computedRunners.forEach((effect) => effect());
  }
}
