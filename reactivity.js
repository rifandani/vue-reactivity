const product = { price: 15, quantity: 2 }; // state

let total = product.price * product.quantity; // derived state

console.log('first', total);

product.quantity = 3;
console.log('second', total); // Does not recalculate

product.price = 12;
console.log('third', total); // Does not recalculate

product.price = 20;
total = product.price * product.quantity;
console.log('last', total); // Recalculate due to previous line

// executing total = product.price * product.quantity
// every time something changes would be tedious

// results in console =>
// first 30
// second 30
// third 30
// last 60
