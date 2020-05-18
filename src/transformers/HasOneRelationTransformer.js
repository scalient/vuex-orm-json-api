import RelationTransformer from "./RelationTransformer";

export default class extends RelationTransformer {
  transform(data, output) {
    this.constructor.checkSingleton(data);

    let relatedModel = this.relation.related;
    let expectedType = relatedModel.entity;
    let {type: resourceType, id} = data;

    this.constructor.checkType(this.resourceToEntityCase(resourceType), expectedType);

    // See `https://vuex-orm.org/guide/model/relationships.html#one-to-one`,
    // `https://vuex-orm.org/guide/model/relationships.html#one-to-one-inverse`, and
    // `https://vuex-orm.org/guide/model/relationships.html#one-to-one-polymorphic`.
    output[this.name] = {[relatedModel.localKey()]: id};

    return output;
  }
}
