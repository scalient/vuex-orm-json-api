import RelationTransformer from "./RelationTransformer";

export default class extends RelationTransformer {
  transform(data, output) {
    this.constructor.checkSingleton(data);

    let parentModel = this.relation.parent;
    let foreignKey = this.relation.foreignKey;
    let expectedType = parentModel.entity;
    let {type: resourceType, id} = data;

    this.constructor.checkType(this.resourceToEntityCase(resourceType), expectedType);

    // See `https://vuex-orm.org/guide/model/relationships.html#one-to-one-inverse`.
    output[this.name] = {[parentModel.localKey()]: id};
    output[foreignKey] = id;

    return output;
  }
}
