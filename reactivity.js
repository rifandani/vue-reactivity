const product = reactive({ price: 15, quantity: 2 }); // state

let total = 0; // derived state
/**
 * store all states in weak reference
 * data structure be like:
 *
 * WeakMap [
 *   { key: { price: 15, quantity: 2 }, value:
 *     Map [
 *       { key: 'price', value:
 *         Set [ calculateTotal ] // always consist of one calculateTotal function, because Set prohibit the same reference
 *       },
 *       { key: 'quantity', value:
 *         Set [ calculateTotal ] // always consist of one calculateTotal function, because Set prohibit the same reference
 *       }
 *     ]
 *   },
 * ];
 */
let targetMap = new WeakMap();

const calculateTotal = () => {
  total = product.price * product.quantity;
};

// Register an effect
function track(target, key) {
  console.log('🔎 track', key);

  // Get depsMap from targetMap
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // mutate depsMap if it doesn't exist yet
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // Get dep from depsMap
  let depsSet = depsMap.get(key);
  if (!depsSet) {
    // mutate depsSet if it doesn't exist yet
    depsSet = new Set();
    depsMap.set(key, depsSet);
  }

  // Add effect
  depsSet.add(calculateTotal);
}

// Execute all registered effects for the target/key combination
function trigger(target, key) {
  console.log('💥 trigger', key);

  // Get depsMap from targetMap
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // If there is no depsMap, no need to resume
    console.log(`💥 trigger - depsMap does not exists with target =>`, target);
    return;
  }

  // Get dep from depsMap
  let depsSet = depsMap.get(key);
  if (!depsSet) {
    console.log(`💥 trigger - depsSet does not exists with key =>`, key);
    // If there is no dep, no need to resume
    return;
  }

  // Execute all effects
  depsSet.forEach((effect) => effect());
}

// Makes an object "reactive".
// Changes will be triggered, once the property is tracked
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

// still needs to be executed once!
// if not, the properties will never be tracked
// this will be fixed in stage 6
calculateTotal();

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
