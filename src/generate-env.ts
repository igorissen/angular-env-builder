import 'dotenv/config'
import {BuilderContext, BuilderOutput, createBuilder} from "@angular-devkit/architect";
import {access, mkdir, writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
import {Options, Variable} from "./types";

export default createBuilder(generateEnvironmentFileBuilder);

async function generateEnvironmentFileBuilder(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  try {
    const destination = options.destination ? options.destination : 'src/environments/environment.ts';
    const env = _getEnvObject(options.variables);
    const fileContent = `export const environment = ${JSON.stringify(env, null, 2)};\n`;

    await _writeFile(destination, fileContent);

    return { success: true };
  } catch(error) {
    console.error(error);
    return { success: false };
  }
}

function _getEnvObject(variables: Variable[]): object {
  const env = {};

  variables.forEach(({envKey, processEnvKey, valueType}) => {
    switch (valueType) {
      case "boolean":
        env[envKey] = process.env[processEnvKey] === 'true';
        break;
      case "number":
        env[envKey] = _toNumber(process.env[processEnvKey]);
        break;
      case "object":
        env[envKey] = _parseJson(process.env[processEnvKey]);
        break;
      default:
        env[envKey] = process.env[processEnvKey];
    }
  })

  return env;
}

function _toNumber(value: string): number {
  const number = Number(value);
  return isNaN(number) ? 0 : number;
}

function _parseJson(value: string): object | undefined {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

async function _writeFile(destination: string, fileContent: string): Promise<void> {
  const path = dirname(destination);
  const isDirectoryExists = await _isExists(path);

  if (!isDirectoryExists && path !== '.') {
    await mkdir(path, {recursive: true});
  }

  await writeFile(destination, fileContent, {encoding:"utf-8"});
}

async function _isExists(dirPath: string): Promise<boolean> {
  try {
    await access(dirPath);
    return true;
  } catch {
    return false;
  }
}
