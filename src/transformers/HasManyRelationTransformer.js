import RelationTransformer from "./RelationTransformer";

export default class extends RelationTransformer {
  transform(data, output) {
    this.constructor.checkMany(data);

    let relatedModel = this.relation.related;
    let relatedLocalKey = relatedModel.localKey();
    let expectedType = relatedModel.entity;

    // See `https://vuex-orm.org/guide/model/relationships.html#one-to-many`,
    // `https://vuex-orm.org/guide/model/relationships.html#many-to-many`, and
    // `https://vuex-orm.org/guide/model/relationships.html#many-to-many-polymorphic`.
    output[this.name] = data.map(({type: resourceType, id}) => {
      this.constructor.checkType(this.resourceToEntityCase(resourceType), expectedType);

      return {[relatedLocalKey]: id};
    });

    return output;
  }
}
