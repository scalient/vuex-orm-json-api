import VuexOrmJsonApi from './VuexOrmJsonApi';

export default class {
  static install(components, config) {
    (new VuexOrmJsonApi(components, config)).install();
  }
}

export {default as RestfulActionsMixin} from './mixins/RestfulActionsMixin';
