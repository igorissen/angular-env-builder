import {beforeEach, describe, expect, it} from "vitest";
import {schema} from "@angular-devkit/core";
import {TestingArchitectHost} from "@angular-devkit/architect/testing";
import {Architect} from "@angular-devkit/architect";
import path from 'node:path'
import fs from 'node:fs/promises'
import {Options} from "./types";

// @ts-expect-error test file is excluded from the build
const __DIRNAME = import.meta.dirname;

describe('Environment file builder', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;

  beforeEach(async () => {
    const registry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    architectHost = new TestingArchitectHost(__DIRNAME, __DIRNAME);
    architect = new Architect(architectHost, registry);

    await architectHost.addBuilderFromPackage(path.join(__DIRNAME, '..'))
  })

  describe('based on environment variables', function () {
    it('creates the "src/environments/environment.ts" file', async () => {
      // given
      const expectedEnvironmentFileContent = `export const environment = {
  "apiUrl": "http://test.api.com",
  "apiPayload": {
    "varA": "valueA"
  },
  "apiPort": 4321,
  "apiEnabled": true
};\n`;
      const options: Options = {
        destination: 'environment.ts',
        variables: [
          {
            envKey: 'apiUrl',
            processEnvKey: 'API_URL',
            valueType: 'string'
          },
          {
            envKey: 'apiPayload',
            processEnvKey: 'API_PAYLOAD',
            valueType: 'object'
          },
          {
            envKey: 'apiPort',
            processEnvKey: 'API_PORT',
            valueType: 'number'
          },
          {
            envKey: 'apiEnabled',
            processEnvKey: 'API_ENABLED',
            valueType: 'boolean'
          }
        ]
      };
      const run = await architect.scheduleBuilder('@igorissen/angular-env-builder:generate', options);

      // when
      await run.result;
      await run.stop();

      // then
      const environmentFileContent = await fs.readFile('environment.ts', 'utf-8');
      expect(environmentFileContent).toBe(expectedEnvironmentFileContent);
    });
  });
});
