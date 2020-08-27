import {PROJECT_NAME_HUMANIZED} from './constants';
import JsonApiError from './JsonApiError';

export default class {
  static error(message) {
    return new JsonApiError(`[${PROJECT_NAME_HUMANIZED}] ${message}`);
  }

  static modelFor(database, type) {
    const model = database.models()[type];

    if (!model) {
      throw this.error(`Couldn't find the model for entity type \`${type}\``);
    }

    return model;
  }
}
