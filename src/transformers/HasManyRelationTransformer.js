import RelationTransformer from './RelationTransformer';

export default class extends RelationTransformer {
  transform(data, output, selfId = null, insertionStore = null) {
    this.constructor.checkMany(data);

    let selfType = this.relation.model.entity;
    let relatedModel = this.relation.related;
    let pivot = this.relation.pivot;
    let foreignKey = this.relation.foreignKey;
    let polymorphicIdKey = this.relation.id;
    let polymorphicTypeKey = this.relation.type;
    let relatedLocalKey = relatedModel.localKey();
    let expectedType = relatedModel.entity;

    /*
     * See `https://vuex-orm.org/guide/model/relationships.html#one-to-many`,
     * `https://vuex-orm.org/guide/model/relationships.html#many-to-many`, and
     * `https://vuex-orm.org/guide/model/relationships.html#many-to-many-polymorphic`.
     */
    output[this.name] = data.map(({type: resourceType, id}) => {
      let type = this.resourceToEntityCase(resourceType);

      this.constructor.checkType(type, expectedType);

      /*
       * Don't proceed if a pivot model is present; in other words, process direct relations and not "through"
       * relations.
       */
      if (!pivot && insertionStore) {
        /*
         * Instead of creating an embedded record, defer to the `InsertionStore` and make this record visible to later
         * JSON:API resources.
         */
        let record = insertionStore.fetchRecord(type, id, relatedLocalKey);
        let data = record.data;

        // Fill in the inverse side of this relation.
        if (!this.isPolymorphic) {
          data[foreignKey] = selfId;
        } else {
          data[polymorphicIdKey] = selfId;
          data[polymorphicTypeKey] = selfType;
        }

        return null;
      } else {
        return {[relatedLocalKey]: id};
      }
    }).filter((record) => !!record);

    return output;
  }
}
