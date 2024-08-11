# angular-env-builder

[![Build and test](https://github.com/igorissen/angular-env-builder/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/igorissen/angular-env-builder/actions/workflows/build-and-test.yml)

Custom angular builder to generate "src/environments/environment.ts" file based on your environment variables.

## Installation

```bash
npm install --save-dev @igorissen/angular-env-builder
```

You must install the dotenv package in version 16.4.x as it is a peer dependency.

```bash
npm install --save-dev dotenv@16.4
```

## Configuration

After installation, you need to configure the builder in your Angular project. Update your angular.json file to include angular-env-builder.

1. Open the angular.json file in your project's root directory.
2. Add the builder to the desired architect target
```json5
{
  // ...
  "projects": {
    "[your-app-name]": {
      "architect": {
        "[target-name]": {
          "builder": "@igorissen/angular-env-builder:generate",
          "options": {
            "destination": "src/environments/environment.ts",
            "variables": [
              {
                "envKey": "apiUrl",
                "processEnvKey": "API_URL",
                "valueType": "string"
              },
              {
                "envKey": "apiPayload",
                "processEnvKey": "API_PAYLOAD",
                "valueType": "object"
              },
              {
                "envKey": "apiPort",
                "processEnvKey": "API_PORT",
                "valueType": "number"
              },
              {
                "envKey": "apiEnabled",
                "processEnvKey": "API_ENABLED",
                "valueType": "boolean"
              }
            ]
          }
        }
      }
    }
  }
  // ...
}
```
3. Replace `[target-name]` with the target you are customizing (e.g., _build_, _serve_, etc.), and provide necessary options as needed by the builder.

## Builder Options

This table provides a structured overview of each property and its intended type and purpose within the `options` object.

| Property    | Type   | Description                                                    |
|-------------|--------|----------------------------------------------------------------|
| **destination** | string | The file path where the environment variables will be written. |
| **variables** | array of objects | An array containing objects that define each environment variable to process. |

Each object within the `variables` array has the following properties:

| Property                                                                                                                 | Type   | Description                                                                                             |
|--------------------------------------------------------------------------------------------------------------------------|--------|---------------------------------------------------------------------------------------------------------|
| **envKey** | string | The key to be used in the output environment file (environment.ts) to access the environment variable.  |
| **processEnvKey** | string | The key used to reference the environment variable from the Node.js process (process.env).              |
| **valueType** | string | The expected data type of the environment variable value. It can be string, object, number, or boolean. |


## Usage

Once configured, you can run the builder using Angular CLI:

```bash
ng run [project-name]:[target-name]
```

Replace `[project-name]` with the name of your Angular project and `[target-name]` with the target you configured.

## Support

If you encounter any issues, feel free to [create an issue](https://github.com/igorissen/angular-env-builder/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
