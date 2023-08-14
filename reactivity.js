/**
 * @type {Function / null}
 */
let activeEffect = null;

/**
 * store all states in weak reference
 *
 * @type {WeakMap<object, Map<PropertyKey, Set<Function>>>}
 */
let targetMap = new WeakMap();

/**
 * Register/Track an effect.
 *
 * @param {object} target - could be an empty object
 * @param {PropertyKey} key - valid object property
 */
function track(target, key) {
  // Get depsMap from targetMap
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // new depsMap if it doesn't exist yet
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // Get dep from depsMap
  let dep = depsMap.get(key);
  if (!dep) {
    // new dep if it doesn't exist yet
    dep = new Set();
    depsMap.set(key, dep);
  }

  // Add effect
  if (activeEffect) dep.add(activeEffect);
}

/**
 * Execute all registered effects for the target/key combination
 *
 * @param {object} target - could be an empty object
 * @param {PropertyKey} key - valid object property
 */
function trigger(target, key) {
  // Get depsMap from targetMap
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // If there is no depsMap, no need to resume
    return;
  }

  // Get dep from depsMap
  let dep = depsMap.get(key);
  if (!dep) {
    // If there is no dep, no need to resume
    return;
  }

  // Execute all effects
  dep.forEach((effect) => effect());
}

/**
 * Makes an object "reactive".
 * Changes will be triggered, once the property is tracked
 *
 * @param {object} target - MUST be an object
 * @returns {Proxy}
 */
function reactive(target) {
  const handler = {
    /**
     * Intercept getter
     *
     * @param {object} target - MUST be an object
     * @param {PropertyKey} key - valid object property
     * @param {Proxy} receiver - the Proxy itself
     * @returns {object}
     */
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key); // track changes for the key in the target
      return result;
    },
    /**
     * Intercept setter
     *
     * @param {object} target - MUST be an object
     * @param {PropertyKey} key - valid object property
     * @param {any} value - anything
     * @param {Proxy} receiver - the Proxy itself
     * @returns {boolean}
     */
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // trigger a change in the target
      return result;
    },
  };

  return new Proxy(target, handler);
}

/**
 * Watcher, run effects if it exists
 *
 * @param {Function} fn - function to run as side effects
 */
function effect(fn) {
  activeEffect = fn;
  // Only execute when there is an activeEffect
  if (activeEffect) activeEffect();
  activeEffect = null;
}

/**
 * The ref class is a reactive object with a single "virtual" value (called "value").
 *
 * @description Currently does not support deep object tracking.
 * @param {any} raw - any value
 * @returns {{ value: any }} wrapped value in "virtual" .value prop
 */
function ref(raw) {
  let r = {
    /**
     * Intercept getter
     *
     * @returns {any} - whatever user passed in
     */
    get value() {
      track(r, 'value');
      return raw;
    },
    /**
     * Intercept setter
     *
     * @param {any} newValue - could be any value
     */
    set value(newValue) {
      raw = newValue;
      trigger(r, 'value');
    },
  };
  return r;
}

/**
 * Computed property which uses `ref` and register `effect` behind the scenes.
 *
 * @template T
 * @param {() => T} getter - function that returns any value
 * @returns {{ value: T }} wrapped value in "virtual" .value prop
 */
function computed(getter) {
  let result = ref();
  effect(() => {
    result.value = getter();
  });

  return result;
}
