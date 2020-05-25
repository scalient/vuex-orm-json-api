import Utils from "../Utils";
import AttributeTransformer from "./AttributeTransformer";
import BelongsToRelationTransformer from "./BelongsToRelationTransformer";
import HasManyByRelationTransformer from "./HasManyByRelationTransformer";
import HasManyRelationTransformer from "./HasManyRelationTransformer";
import HasManyThroughRelationTransformer from "./HasManyThroughRelationTransformer";
import HasOneRelationTransformer from "./HasOneRelationTransformer";
import MorphToRelationTransformer from "./MorphToRelationTransformer";

export default class {
  constructor(model, config) {
    this.relationTransformers = {};
    this.attributeTransformers = {};
    this.resourceToEntityCase = config.resourceToEntityCase;

    let {
      HasOne, BelongsTo, HasMany, HasManyBy, HasManyThrough, BelongsToMany, MorphTo, MorphOne, MorphMany, MorphToMany,
      MorphedByMany, Attr, String, Number, Boolean, Uid
    } = config.attributeClasses;

    Object.entries(model.fields()).forEach(([fieldName, field]) => {
      let fieldType = field.constructor;

      switch (fieldType) {
      case HasOne:
      case MorphOne:
        this.relationTransformers[fieldName] = new HasOneRelationTransformer(fieldName, field, config);
        break;
      case BelongsTo:
        this.relationTransformers[fieldName] = new BelongsToRelationTransformer(fieldName, field, config);
        break;
      case HasMany:
      case BelongsToMany:
      case MorphMany:
      case MorphToMany:
      case MorphedByMany:
        this.relationTransformers[fieldName] = new HasManyRelationTransformer(fieldName, field, config);
        break;
      case HasManyBy:
        this.relationTransformers[fieldName] = new HasManyByRelationTransformer(fieldName, field, config);
        break;
      case HasManyThrough:
        this.relationTransformers[fieldName] = new HasManyThroughRelationTransformer(fieldName, field, config);
        break;
      case MorphTo:
        this.relationTransformers[fieldName] = new MorphToRelationTransformer(fieldName, field, config);
        break;
      case Attr:
      case String:
      case Number:
      case Boolean:
      case Uid:
        this.attributeTransformers[fieldName] = new AttributeTransformer(fieldName, config);
        break;
      default:
        throw Utils.error(`Field type \`${fieldType}\` not recognized for field \`${fieldName}\``);
      }
    });
  }

  transform(data, output, insertionStore) {
    const id = data.id;

    this.attributeTransformers.id.transform(id, output);

    if (data.attributes) {
      Object.entries(data.attributes).forEach(([attributeName, value]) => {
        // Convert JSON:API casing to Vuex ORM casing and look up the attribute.
        attributeName = this.resourceToEntityCase(attributeName);

        let transformer = this.attributeTransformers[attributeName];

        if (transformer) {
          transformer.transform(value, output);
        }
      });
    }

    if (data.relationships) {
      Object.entries(data.relationships).forEach(([relationName, data]) => {
        // Convert JSON:API casing to Vuex ORM casing and look up the relation.
        relationName = this.resourceToEntityCase(relationName);

        let transformer = this.relationTransformers[relationName];

        if (transformer) {
          transformer.transform(data.data, output, id, insertionStore);
        }
      });
    }
  }
}
