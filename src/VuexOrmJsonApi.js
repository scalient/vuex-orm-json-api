import ModelMixin from "./mixins/ModelMixin";

export default class {
  constructor(components, config) {
    this.modelComponent = components.Model;
    this.config = config;
  }

  install() {
    ModelMixin.include(this.modelComponent, this.config);
  }
}
