import { GeneratorConfig } from 'ng-openapi';

export default {
  input: './swagger.json',
  output: './src/client',
  options: {
    dateType: 'string',
    enumStyle: 'enum',
  },
} as GeneratorConfig;
