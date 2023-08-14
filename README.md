# Vue 3 Reactivity

It contains a basic implementation of the Vue 3 reactivity engine - from scratch.

> Credits: This material was created by [Marc Backes](https://twitter.com/themarcba) in order to show how reactivity is solved in Vue 3.

> The differences: I add more context and comments in every stages. I delete the original `stage/2` branch, because it actually the same as the previous branch. I implement `ref` instead of `reactive` in the HTML in `stage/11`. I implement `ref` and `computed` in the HTML in `stage/12`.

# Stages

This is the **main branch**, but there are branches that represent different stages of the project, so people can follow along step by step.

- [Stage 0](https://github.com/rifandani/vue-reactivity/tree/stage/1): Basic HTML and JS structure set up
- [Stage 1](https://github.com/rifandani/vue-reactivity/tree/stage/1): Prove why we need a reactivity engine
- [Stage 4](https://github.com/rifandani/vue-reactivity/tree/stage/4): Write reactive function
- [Stage 5](https://github.com/rifandani/vue-reactivity/tree/stage/5): Enhance observer pattern (with WeakMap)
- [Stage 6](https://github.com/rifandani/vue-reactivity/tree/stage/6): Add watcher
- [Stage 7](https://github.com/rifandani/vue-reactivity/tree/stage/7): Refactor code take out user code from lib code
- [Stage 8](https://github.com/rifandani/vue-reactivity/tree/stage/8): Change total in the DOM
- [Stage 9](https://github.com/rifandani/vue-reactivity/tree/stage/9): Add buttons that change the quantity (and total in the DOM)
- [Stage 10](https://github.com/rifandani/vue-reactivity/tree/stage/10): Add color picker
- [Stage 11](https://github.com/rifandani/vue-reactivity/tree/stage/11): Add ref
- [Stage 12](https://github.com/rifandani/vue-reactivity/tree/stage/12): Add computed property
