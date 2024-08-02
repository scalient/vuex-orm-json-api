import Utils from '../Utils';
import Response from './Response';
import JsonApiError from '../JsonApiError';

export default class {
  /**
   * Creates a new request.
   */
  constructor(model) {
    this.model = model;
  }

  /*
   * Gets the axios instance.
   */
  get axios() {
    if (!this.model.axios) {
      return Utils.error('The axios instance is not registered. Please register the axios instance to the model.');
    }

    return this.model.axios;
  }

  /**
   * Performs an HTTP `GET`.
   */
  get(url, config = {}) {
    return this.request({
      method: 'get', url,
      ...config,
    });
  }

  /**
   * Performs an HTTP `POST`.
   */
  post(url, data = {}, config = {}) {
    return this.request({
      method: 'post', url, data,
      ...config,
    });
  }

  /**
   * Performs an HTTP `PUT`.
   */
  put(url, data = {}, config = {}) {
    return this.request({
      method: 'put', url, data,
      ...config,
    });
  }

  /**
   * Performs an HTTP `PATCH`.
   */
  patch(url, data = {}, config = {}) {
    return this.request({
      method: 'patch', url, data,
      ...config,
    });
  }

  /**
   * Performs an HTTP `DELETE`.
   */
  delete(url, config = {}) {
    return this.request({
      method: 'delete', url,
      ...config,
    });
  }

  /**
   * Performs an API request: Awaits an axios request, gets the axios response, and awaits the database commit.
   */
  async request(config) {
    return await (await this.rawRequest(config)).commit();
  }

  /**
   * Performs an API request: Awaits an axios request, gets the axios response, does not make a database commit, and
   * returns the original response object for inspection of stuff like JSON:API `meta`.
   */
  async rawRequest(config) {
    const axiosConfig = {
      ...this.model.globalJsonApiConfig,
      ...this.model.jsonApiConfig,
      ...config,
    };

    try {
      return new Response(this.model, await this.axios.request(axiosConfig), axiosConfig);
    } catch (axiosError) {
      throw new JsonApiError(axiosError, new Response(this.model, axiosError.response, axiosConfig));
    }
  }
}
