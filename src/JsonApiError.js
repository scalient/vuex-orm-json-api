export default class extends Error {
  /**
   * Creates a new library error.
   */
  constructor(axiosError, jsonApiResponse) {
    super(axiosError.message, {cause: axiosError});

    this.response = jsonApiResponse;
  }
}
