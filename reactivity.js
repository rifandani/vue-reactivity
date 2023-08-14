// type Dep = Set<any>
// type KeyToDepMap = Map<any, Dep>

/**
 * @type {Map<RefImpl, Map<'value', Set<Function>>>}
 */
const targetMap = new Map();
/**
 * @type {Function | undefined}
 */
let activeEffect;

/**
 * @param {object} target
 */
const track = (target) => {
  /**
   * return early if activeEffect is undefined.
   */
  if (!activeEffect) {
    return;
  }

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get('value');
  if (!deps) {
    deps = new Set();
    depsMap.set('value', deps);
  }

  deps.add(activeEffect);
};

/**
 * @param {object} target
 */
const trigger = (target) => {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  depsMap.forEach((dep) => {
    dep.forEach((eff) => {
      eff();
    });
  });
};

class RefImpl {
  /**
   * @type {string}
   */
  _value;

  /**
   * @param {string} val
   */
  constructor(val) {
    this._value = val;
  }

  /**
   * @returns {string}
   */
  get value() {
    track(this);
    return this._value;
  }

  /**
   * @param {string} val
   */
  set value(val) {
    this._value = val;
    trigger(this);
  }
}

/**
 * @param {string} val
 * @returns {RefImpl}
 */
const ref = (val) => {
  return new RefImpl(val);
};

/**
 * @param {Function} fn
 */
const effect = (fn) => {
  activeEffect = fn;
  fn();
  activeEffect = undefined;
};

const fooref = ref('foo');
let foo;
effect(() => {
  foo = fooref.value;
});
console.log(foo === 'foo'); // true
fooref.value = 'bar';
console.log(foo === 'bar'); // true

// results in console =>
// true
// true
