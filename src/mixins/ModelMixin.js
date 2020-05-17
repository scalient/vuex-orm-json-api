export default class {
  static include(modelComponent, config) {
    // Only install axios if it hasn't been set by plugin-axios.
    modelComponent.axios = modelComponent.axios || config.axios || null;

    // The global config shared by all models.
    modelComponent.globalJsonApiConfig = config;

    // Model-specific config.
    modelComponent.jsonApiConfig = {};

    // Only install the `setAxios` function if it hasn't been set by plugin-axios.
    modelComponent.setAxios = modelComponent.setAxios || function (axios) {
      this.axios = axios;
    };

    // The JSON:API adapter.
    modelComponent.jsonApi = function () {
    };
  }
}
