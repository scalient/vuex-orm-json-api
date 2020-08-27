import RelationTransformer from './RelationTransformer';

export default class extends RelationTransformer {
  transform(data, output) {
    this.constructor.checkSingleton(data);

    let {type: resourceType, id} = data;

    // See `https://vuex-orm.org/guide/model/relationships.html#one-to-one-polymorphic`.
    output[this.relation.id] = id;
    output[this.relation.type] = this.resourceToEntityCase(resourceType);

    return output;
  }
}
