export default class {
  constructor(database, config) {
    this.database = database;
    this.resourceToEntityCase = config.resourceToEntityCase;
  }

  transform(data) {
    let primaryData = data.data;

    if (primaryData instanceof Array) {
      primaryData = primaryData.map((data) => this.transformResource(data));
    } else {
      primaryData = this.transformResource(primaryData);
    }

    let includedData = data.included;

    if (includedData) {
      includedData = includedData.map((data) => this.transformResource(data));
    }

    return {data: primaryData, included: includedData};
  }

  transformResource(data) {
    // Convert JSON:API casing to Vuex ORM casing and look up the model.
    let model = this.database.model(this.resourceToEntityCase(data.type));

    let output = {type: model.entity, data: {}};

    model.jsonApiTransformer.transform(data, output.data);

    return output;
  }
}
