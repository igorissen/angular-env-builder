import {JsonObject} from "@angular-devkit/core";

export type Variable = {
  envKey: string;
  processEnvKey: string;
  valueType: 'string' | 'boolean' | 'number' | "object";
};

export interface Options extends JsonObject {
  destination?: string;
  variables: Variable[];
}
