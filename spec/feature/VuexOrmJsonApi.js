import VuexORM from "@vuex-orm/core";
import VuexOrmJsonApi from "@/index";

import {describe, expect, it} from "@jest/globals";

describe("Feature - Vuex ORM JSON:API", () => {
  it("throws an error when VuexORMAxios isn't installed", () => {
    expect(() => VuexORM.use(VuexOrmJsonApi)). //
      toThrowError("It looks like `VuexORMAxios` wasn't installed. Have you considered running " +
        "`VuexORM.use(VuexORMAxios, { axios })`?"
      );
  });
});
