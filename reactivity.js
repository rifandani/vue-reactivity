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
  // TODO: add implementation
};

const fooref = ref('foo');
let foo;
effect(() => {
  foo = fooref.value;
});
console.log(foo === 'foo');

// results in console =>
// false
