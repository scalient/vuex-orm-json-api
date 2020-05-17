import ModelMixin from "./mixins/ModelMixin";

export default class {
  constructor(components, config) {
    this.modelComponent = components.Model;
    this.config = config;
  }

  install() {
    if (!this.modelComponent.api ||
      !this.modelComponent.apiConfig ||
      !this.modelComponent.globalApiConfig ||
      !this.modelComponent.setAxios) {
      throw ("It looks like `VuexORMAxios` wasn't installed. Have you considered running " +
        "`VuexORM.use(VuexORMAxios, { axios })`?");
    }

    ModelMixin.include(this.modelComponent, this.config);
  }
}
