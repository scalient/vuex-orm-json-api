import FieldTransformer from './FieldTransformer';

export default class extends FieldTransformer {
  constructor(name, attribute, _config = {}) {
    super(name);

    this.attribute = attribute;
  }

  transform(value, output) {
    output[this.name] = value;
  }
}
