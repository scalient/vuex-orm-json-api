import {API_ROOT, defaultResourceToEntityCase, defaultEntityToResourceRouteCase} from '../constants';
import ModelTransformer from '../transformers/ModelTransformer';
import Request from '../json_api/Request';

export default class {
  static include(modelComponent, attributeClasses, config) {
    // Only install axios if it hasn't been set by plugin-axios.
    modelComponent.axios = modelComponent.axios || config.axios || null;

    // The global config shared by all models. Set sensible defaults from `constants.js`.
    modelComponent.globalJsonApiConfig = {
      apiRoot: API_ROOT,
      resourceToEntityCase: defaultResourceToEntityCase,
      entityToResourceRouteCase: defaultEntityToResourceRouteCase,
      attributeClasses: attributeClasses,
      ...config,
    };

    // Model-specific config.
    modelComponent.jsonApiConfig = {};

    // Only install the `setAxios` function if it hasn't been set by plugin-axios.
    modelComponent.setAxios = modelComponent.setAxios || function (axios) {
      this.axios = axios;
    };

    // A cache containing model entity name to transformer mappings.
    Object.defineProperty(modelComponent, 'jsonApiTransformer', {
      get: function () {
        let config = {...this.globalJsonApiConfig, ...this.jsonApiConfig};

        if (!this.cachedTransformer) {
          this.cachedTransformer = new ModelTransformer(this, config);
        }

        return this.cachedTransformer;
      },
    });

    // The JSON:API adapter.
    modelComponent.jsonApi = function () {
      return new Request(this);
    };

    (modelComponent.globalJsonApiConfig.mixins || []).forEach((mixin) => mixin.include(Request));
  }
}
