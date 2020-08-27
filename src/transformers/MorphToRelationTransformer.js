import RelationTransformer from './RelationTransformer';

export default class extends RelationTransformer {
  transform(data, output) {
    /*
     * `null` is an acceptable value for to-one relationships: See
     * `https://jsonapi.org/format/#document-resource-object-linkage`.
     */
    if (data === null) {
      return null;
    }

    this.constructor.checkSingleton(data);

    let {type: resourceType, id} = data;

    // See `https://vuex-orm.org/guide/model/relationships.html#one-to-one-polymorphic`.
    output[this.relation.id] = id;
    output[this.relation.type] = this.resourceToEntityCase(resourceType);

    return output;
  }
}
