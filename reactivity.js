let activeEffect = null; // Function / null
/**
 * store all states in weak reference
 * data structure be like:
 *
 * WeakMap [
 *   { key: { price: 15, quantity: 2 }, value:
 *     Map [
 *       { key: 'price', value:
 *         Set [ activeEffect ]
 *       },
 *       { key: 'quantity', value:
 *         Set [ activeEffect ]
 *       }
 *     ]
 *   },
 * ];
 */
let targetMap = new WeakMap();

// Register an effect
function track(target, key) {
  console.log('🔎 track', key);

  // Get depsMap from targetMap
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // new depsMap if it doesn't exist yet
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // Get dep from depsMap
  let depsSet = depsMap.get(key);
  if (!depsSet) {
    // new dep if it doesn't exist yet
    depsSet = new Set();
    depsMap.set(key, depsSet);
  }

  // Add effect
  if (activeEffect) depsSet.add(activeEffect);
}

// Execute all registered effects for the target/key combination
function trigger(target, key) {
  console.log('💥 trigger', key);

  // Get depsMap from targetMap
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // If there is no depsMap, no need to resume
    return;
  }

  // Get dep from depsMap
  let depsSet = depsMap.get(key);
  if (!depsSet) {
    // If there is no dep, no need to resume
    return;
  }

  // Execute all effects
  depsSet.forEach((effect) => effect());
}

// Makes an object "reactive". Changes will be triggered, once the property is tracked
function reactive(target) {
  const handler = {
    // Intercept getter
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key); // track changes for the key in the target
      return result;
    },
    // Intercept setter
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // trigger a change in the target
      return result;
    },
  };
  return new Proxy(target, handler);
}

// Watcher
function effect(fn) {
  activeEffect = fn;
  // Only execute when there is an activeEffect
  if (activeEffect) activeEffect();
  activeEffect = null;
}

const product = reactive({ price: 15, quantity: 2 }); // state
let total = 0; // derived state

// Actually registering a side effect, instead of manual calculateTotal function from before
effect(() => {
  total = product.price * product.quantity;
});

console.log(total);
product.quantity = 100;
console.log(product.quantity);

// results in console =>
// 🔎 track price
// 🔎 track quantity
// 30
// 💥 trigger quantity
// 🔎 track price
// 🔎 track quantity
// 🔎 track quantity
// 100
