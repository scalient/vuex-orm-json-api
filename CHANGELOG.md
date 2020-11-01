### 0.9.7 (2020-11-01)

- Handle STI correctly when pivot models are involved in `BelongsToMany`, `MorphByMany`, and `MorphToMany` relations.
- Introduce STI unit tests.
- Fix an issue with type checking.
- Fix an issue with the `InsertionStore`.

### 0.9.6 (2020-08-27)

- Add `null` value checks for to-one transformers.
- Use `Promise.all` on an array of Vuex ORM mutator promises instead of `await` on individual promises in a `for` loop.

### 0.9.5 (2020-05-25)

- Public release.
