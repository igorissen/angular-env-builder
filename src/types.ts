import {JsonObject} from "@angular-devkit/core";

export type Variable = {
  envKey: string;
  processEnvKey: string;
  valueType: 'string' | 'boolean' | 'number' | "object";
};

export interface Options extends JsonObject {
  // @ts-expect-error destination is optional
  destination?: string;
  variables: Variable[];
}
