const product = reactive({ price: 15, quantity: 2 });

let total = 0;
let deps = new Set(); // list of effects will be saved here

const calculateTotal = () => {
  total = product.price * product.quantity;
};

// Register an effect
function track(target, key) {
  console.log('🔎 track', key);
  // target and key are not used yet.
  // they will come into play in stage 5

  // Add effect
  deps.add(calculateTotal);
}

// Execute all registered effects for the target/key combination
function trigger(target, key) {
  console.log('💥 trigger', key);
  // target and key are not used yet.
  // they will come into play in stage 5

  // Execute all effects
  deps.forEach((effect) => effect());
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

product.price = 12;
product.quantity = 5;

// results in console =>
// 🔎 track price
// 🔎 track quantity
// 💥 trigger price
// 🔎 track price
// 🔎 track quantity
// 💥 trigger quantity
// 🔎 track price
// 🔎 track quantity
