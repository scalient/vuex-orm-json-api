export default class {
  static include(klass) {
    Object.assign(klass.prototype, {
      /*
       * The Rails-y REST `index` action.
       */
      async index(config = {}) {
        return this.get(this.restResourcePath(), {multiplicity: "many", ...config});
      },

      /*
       * The Rails-y REST `show` action.
       */
      async show(id, config = {}) {
        return this.get(this.restResourcePath(id), {id, multiplicity: "one", ...config});
      },

      /*
       * The Rails-y REST `create` action.
       */
      async create(data = {}, config = {}) {
        return this.post(this.restResourcePath(), data, {multiplicity: "one", ...config});
      },

      /*
       * The Rails-y REST `update` action.
       */
      async update(id, data = {}, config = {}) {
        // The JSON:API specification seems to prefer `PATCH` over `PUT`: See
        // `https://jsonapi.org/format/#crud-updating-resource-relationships`.
        return this.patch(this.restResourcePath(id), data, {id, multiplicity: "one", ...config});
      },

      /*
       * The Rails-y REST `destroy` action.
       */
      async destroy(id, config = {}) {
        return this.delete(this.restResourcePath(id), {id, multiplicity: "none", ...config});
      },

      /**
       * Generates the REST resource path from the model and possible id.
       */
      restResourcePath(id = null) {
        let modelConfig = {...this.model.globalJsonApiConfig, ...this.model.jsonApiConfig};
        let apiRoot = modelConfig.apiRoot;
        let restResource = modelConfig.entityToResourceRouteCase(this.model.entity);

        let path = `${apiRoot !== "/" ? apiRoot : ""}/${restResource}`;

        if (id) {
          path = `${path}/${id}`;
        }

        return path;
      },
    });
  }
}
