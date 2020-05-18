import RelationTransformer from "./RelationTransformer";

export default class extends RelationTransformer {
  transform(data, output) {
    this.constructor.checkMany(data);

    let expectedType = this.relation.parent.entity;

    // See `https://vuex-orm.org/guide/model/relationships.html#has-many-by`.
    output[this.relation.foreignKey] = data.map(({type: resourceType, id}) => {
      this.constructor.checkType(this.resourceToEntityCase(resourceType), expectedType);

      return id;
    });

    return output;
  }
}
