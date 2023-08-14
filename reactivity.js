class RefImpl {
  _value; // string

  constructor(val) {
    this._value = val;
  }

  get value() {
    return this._value;
  }
}

const ref = (val) => {
  return new RefImpl(val);
};

const effect = (fn) => {
  // this still not reactive.
  // What we need is some way to tell our system to re-run the effect, everytime object property mutated
  fn();
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
