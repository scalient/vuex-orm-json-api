import RelationTransformer from './RelationTransformer';

export default class extends RelationTransformer {
  transform(data, output) {
    this.constructor.checkMany(data);

    let parentModel = this.relation.parent;

    // See `https://vuex-orm.org/guide/model/relationships.html#has-many-by`.
    output[this.relation.foreignKey] = data.map(({type: resourceType, id}) => {
      this.constructor.checkType(this.resourceToEntityCase(resourceType), parentModel);

      return id;
    });

    return output;
  }
}
