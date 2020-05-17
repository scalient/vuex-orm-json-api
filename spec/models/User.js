import {Model} from "@vuex-orm/core";

export default class extends Model {
  static entity = "users";

  static fields() {
    return {
      id: this.attr(null),
      name: this.attr(null),
    };
  }
}
