import RelationTransformer from './RelationTransformer';
import Utils from '../Utils';

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

    /*
     * See `https://vuex-orm.org/guide/model/relationships.html#one-to-many`,
     * `https://vuex-orm.org/guide/model/relationships.html#many-to-many`, and
     * `https://vuex-orm.org/guide/model/relationships.html#many-to-many-polymorphic`.
     */
    output[this.name] = data.map(({type: resourceType, id}) => {
      let type = this.resourceToEntityCase(resourceType);

      this.constructor.checkType(type, relatedModel);

      /*
       * Don't proceed if a pivot model is present; in other words, process direct relations and not "through"
       * relations.
       */
      if (insertionStore) {
        if (!pivot) {
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
          /**
           * Important: Since JSON:API resources contain type information, we want to preserve that even when pivot
           * models are involved. This means looking up the base model and doing a reverse lookup of the discriminator
           * value to write into discriminator field.
           */
          const database = relatedModel.database();

          const model = Utils.modelFor(database, type);
          const baseType = model.baseEntity;

          const record = {[relatedLocalKey]: id};

          if (baseType) {
            const baseModel = Utils.modelFor(database, baseType);

            for (const [discriminator, mappedModel] of Object.entries(baseModel.types())) {
              if (type === mappedModel.entity) {
                record[baseModel.typeKey || 'type'] = discriminator;
                break;
              }
            }
          }

          return record;
        }
      } else {
        return {[relatedLocalKey]: id};
      }
    }).filter((record) => !!record);

    return output;
  }
}
