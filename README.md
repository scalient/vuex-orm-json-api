# Vuex ORM JSON:API - A JSON:API adapter for Vuex ORM

Vuex ORM JSON:API is a Vuex ORM library plugin for reading the JSON:API format. It contains mechanisms for transforming
the JSON:API specification's flexible, self-describing documents, resources, attributes, and relationships into their
Vuex ORM analogues of records, attributes, and relations. Also included are RESTful actions that extend the
[Vuex ORM Axios](https://github.com/vuex-orm/plugin-axios) plugin's HTTP actions.

### Installation

1.  Installing via NPM:

    ```
    npm install --save vuex-orm-json-api
    ```

    Installing via Yarn:

    ```
    yarn add vuex-orm-json-api
    ```

2.  Importing the plugin:

    ```
    import axios from "axios";
    import VuexORM from "@vuex-orm/core";
    import VuexOrmJsonApi, {RestfulActionsMixin} from "vuex-orm-json-api";
    
    VuexORM.use(VuexOrmJsonApi, {axios, mixins: [RestfulActionsMixin]});
    ```

### Usage

Assuming that you've included the `RestfulActionsMixin`, the adapter supports five, Ruby on Rails-y RESTful actions:

```
User.jsonApi().index();                             // Get all users.
User.jsonApi().show(1);                             // Get user 1.
User.jsonApi().create({name: "Harry Bovik"});       // Create a user.
User.jsonApi().update(1, {name: "Harry Q. Bovik"}); // Update user 1.
User.jsonApi().destroy(1);                          // Destroy user 1.
```

Some considerations:

*   Because JSON:API documents are divided into **primary data** (`data: {}` or `data: []`) and **related resources**
    (`included: []`), all actions come with the side effect of upserting received resources, via `Model.insertOrUpdate`,
    into the Vuex ORM database (or deleting in case of `destroy`).
*   The return value of each action is the upserted record(s) corresponding to the primary data section, with proper
    multiplicity: `Array` for `index`; `Object` for `show`, `create`, and `update`; and `null` for `destroy`.
*  `index`, `show`, `create`, `update`, and `destroy` respectively use the `GET`, `GET`, `POST`, `PATCH`, and `DELETE`
    HTTP methods. The JSON:API specification seems to prefer `PATCH` over `PUT`.
*   You may pass in a `scope` function to qualify returned records further. For example:

    ```
    await User.jsonApi().show(1, {scope: (query) => query.with("users.group")});
    ```

    Additional overridable options include `url` and `method`.

---

The adapter may be configured at installation time

```
VuexORM.use(VuexOrmJsonApi, {axios, mixins: [RestfulActionsMixin], apiRoot: "/"});
```

or at the model level:

```
class User extends Model {
  static jsonApiConfig = {
    apiRoot: "/"
  }
}
```

Configuration options include:

*   `apiRoot` - The path prefix to your API routes. The default is `/api`.
*   `resourceToEntityCase` - The converter from JSON:API resource casing to Vuex ORM model casing. The default is a
    simple kebab-to-snake case function, because the JSON:API specification prefers names like `users-groups` and Vuex
    ORM prefers names like `users_groups`.
*   `entityToResourceRouteCase` - The converter from Vue ORM model casing to resource route casing. The default is a
    no-op because this author writes Ruby on Rails API servers, which happen to also use plural snake case.

### Examples

At a fundamental level, the adapter comprehends Vuex ORM relations and transforms the `relationships` found in JSON:API
documents into insertion-ready data. Consider the following models:

```
class User extends Model {
  static entity = "users"

  static fields() {
    return {
      id: this.attr(null),
      name: this.attr(null),

      groups: this.belongsToMany(Group, UsersGroup, "user_id", "group_id"),
    };
  }
}

class Group extends Model {
  static entity = "groups"

  static fields() {
    return {
      id: this.attr(null),
      name: this.attr(null),

      users: this.belongsToMany(User, UsersGroup, "group_id", "user_id"),
    };
  }
}

class UsersGroup extends Model {
  static entity = "users_groups"

  static primaryKey = ["user_id", "group_id"]

  static fields() {
    return {
      user_id: this.attr(null),
      group_id: this.attr(null),
    };
  }
}
```

The somewhat complex setup above involves two models with bidirectional many-to-many relations and an intermediate model
with composite primary key. Upon making the request

```
await User.jsonApi().show(1);
```

and receiving the response

```
{
  data: {
    id: 1,
    type: 'users',
    attributes: {
      name: 'Harry Bovik',
    },
    relationships: {
      groups: {
        data: [
          {id: 1, type: 'groups'},
        ],
      },
    },
  },
  included: [
    {id: 1, type: 'groups', attributes: {name: 'CMU'}},
  ],
}
```

the state of the Vuex store is what we would expect, composite primary keys and all:

```
{
  users: {
    1: {$id: '1', id: 1, name: 'Harry Bovik', users_groups: [], groups: []},
  },
  groups: {
    1: {$id: '1', id: 1, name: 'CMU', users_groups: [], users: []},
  },
  users_groups: {
    '[1,1]': {$id: '[1,1]', id: null, user_id: 1, user: null, group_id: 1, group: null},
  },
}
```

The JSON:API specification allows for self-describing, intrinsically polymorphic relations. How about those?

```
class Monster extends Model {
  static entity = "monsters"

  static fields() {
    return {
      id: this.attr(null),
      name: this.attr(null),

      scaree_id: this.attr(null),
      scaree_type: this.attr(null),
      scaree: this.morphTo("scaree_id", "scaree_type"),
    };
  }
}

class Child extends Model {
  static entity = "children"

  static fields() {
    return {
      id: this.attr(null),
      name: this.attr(null),

      monster_in_the_closet: this.morphOne(Monster, "scaree_id", "scaree_type"),
    };
  }
}
```

Upon making the request

```
await Child.jsonApi().show(1);
```

and receiving the response

```
{
  data: {
    id: 1,
    type: 'children',
    attributes: {
      name: 'Boo',
    },
    relationships: {
      'monster-in-the-closet': {
        data: {id: 1, type: 'monsters'},
      },
    },
  },
  included: [
    {id: 1, type: 'monsters', attributes: {name: 'Sully'}},
  ],
}
```

the query

```
Child.query().whereId(1).with("monster_in_the_closet").first();
```

will return Boo along with her monster friend Sully.

The adapter transforms all types of Vuex ORM relations except for `HasManyThrough`. In the many-to-many example above,
it takes extra care to ensure that records with composite primary keys have those component `*_id` attributes assigned
before insertion. As a result, Vuex ORM can maintain its own concept of primary key in the internal `$id` attribute
independently of the API server's usage of the `id` attribute in JSON:API resources.

### License

    Copyright 2020 Roy Liu

    Licensed under the Apache License, Version 2.0 (the "License"); you may not
    use this file except in compliance with the License. You may obtain a copy
    of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
    License for the specific language governing permissions and limitations
    under the License.
