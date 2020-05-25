import ModelMixin from "./mixins/ModelMixin";

export default class {
  constructor(components, config) {
    this.modelComponent = components.Model;

    let {
      HasOne, BelongsTo, HasMany, HasManyBy, HasManyThrough, BelongsToMany, MorphTo, MorphOne, MorphMany, MorphToMany,
      MorphedByMany, Attr, String, Number, Boolean, Uid
    } = components;

    this.attributeClasses = {
      HasOne, BelongsTo, HasMany, HasManyBy, HasManyThrough, BelongsToMany, MorphTo, MorphOne, MorphMany, MorphToMany,
      MorphedByMany, Attr, String, Number, Boolean, Uid
    };

    this.config = config;
  }

  install() {
    ModelMixin.include(this.modelComponent, this.attributeClasses, this.config);
  }
}
