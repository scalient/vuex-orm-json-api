import {PROJECT_NAME_HUMANIZED} from "./constants";
import JsonApiError from "./JsonApiError";

export default class {
  static error(message) {
    return new JsonApiError(`[${PROJECT_NAME_HUMANIZED}] ${message}`);
  }
}
