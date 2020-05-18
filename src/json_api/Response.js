import Utils from "../Utils";
import DocumentTransformer from "../transformers/DocumentTransformer";

export default class {
  /**
   * Create a new response instance.
   */
  constructor(model, response, config) {
    this.model = model;
    this.response = response;
    this.config = config;
    this.documentTransformer = new DocumentTransformer(model.database(), config);
  }

  /**
   * Commit response data to the store, returning.
   */
  async commit() {
    let database = this.model.database();
    let responseData = this.response.data;

    let data = null;
    let included = null;

    if (responseData && responseData.data) {
      ({data, included} = this.documentTransformer.transform(responseData));
    }

    let multiplicity = this.config.multiplicity;

    if (!multiplicity) {
      if (data instanceof Array) {
        multiplicity = "many";
      } else if (data) {
        multiplicity = "one";
      } else {
        multiplicity = "none";
      }
    }

    switch (multiplicity) {
    case "many":
      if (!(data instanceof Array) || !data) {
        throw Utils.error("Expected an array JSON:API response, but got an object or nothing instead");
      }

      return await this.commitResources(database, data, included);
    case "one":
      if (data instanceof Array || !data) {
        throw Utils.error("Expected an object JSON:API response, but got an array or nothing instead");
      }

      return await this.commitResource(database, data, included);
    case "none":
      if (data) {
        throw Utils.error("Expected nothing for the JSON:API response's primary data, but got something instead");
      }

      if (this.config.id) {
        await this.deleteRecord(this.config.id);
      }

      return null;
    default:
      throw Utils.error("Control should never reach here");
    }
  }

  /**
   * Upserts a Vuex ORM-ready JSON:API resource.
   */
  async upsertTransformedResource(database, transformedResource) {
    let model = database.model(transformedResource.type);

    await model.insertOrUpdate({data: transformedResource.data});
  }

  /**
   * Finds the newly upserted record from the given resource.
   */
  findRecordFromResource(database, transformedResource) {
    let model = database.model(transformedResource.type);
    let primaryKey = model.primaryKey;
    let primaryKeyValue;

    if (!(primaryKey instanceof Array)) {
      primaryKeyValue = transformedResource.data[primaryKey];
    } else {
      primaryKeyValue = primaryKey.map((keyComponent) => transformedResource[keyComponent]);
    }

    return model.find(primaryKeyValue);
  }

  /**
   * Commits multiple JSON:API resources.
   */
  async commitResources(database, data, included) {
    for (let transformedResource of data.concat(included)) {
      await this.upsertTransformedResource(database, transformedResource);
    }

    return data.map((data) => this.findRecordFromResource(database, data));
  }

  /**
   * Commits a JSON:API resource.
   */
  async commitResource(database, data, included) {
    await this.upsertTransformedResource(database, data);

    for (let transformedResource of included) {
      await this.upsertTransformedResource(database, transformedResource);
    }

    return this.findRecordFromResource(database, data);
  }

  /**
   * Deletes a record.
   */
  async deleteRecord(id) {
    await this.model.delete(id);
  }
}
