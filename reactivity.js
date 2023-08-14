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
console.log(foo === 'bar'); // false

// results in console =>
// true
// false
