import Utils from '../Utils';
import FieldTransformer from './FieldTransformer';

export default class extends FieldTransformer {
  constructor(name, relation, config) {
    super(name);

    this.relation = relation;
    this.resourceToEntityCase = config.resourceToEntityCase;
    this.isPolymorphic = !!(relation.id && relation.type);
  }

  transform(_data, _output, _id = null, _insertionStore = null) {
    throw Utils.error('Method not implemented');
  }

  static checkType(type, expectedType) {
    if (type !== expectedType) {
      throw Utils.error(`Expected type \`${expectedType}\` but got \`${type}\` in relation`);
    }
  }

  static checkMany(data) {
    if (!(data instanceof Array)) {
      throw Utils.error('Expected relation data to be an array');
    }
  }

  static checkSingleton(data) {
    if (data instanceof Array) {
      throw Utils.error('Expected relation data to be an object');
    }
  }
}
