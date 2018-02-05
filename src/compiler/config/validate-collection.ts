import { ConfigCollection } from '../../declarations';


export function validateDependentCollection(userInput: any) {
  if (!userInput || Array.isArray(userInput) || typeof userInput === 'number' || typeof userInput === 'boolean') {
    throw new Error(`invalid collection: ${userInput}`);
  }

  let configCollection: ConfigCollection;

  if (typeof userInput === 'string') {
    configCollection = {
      name: userInput
    };

  } else {
    configCollection = userInput;
  }

  if (!configCollection.name || typeof configCollection.name !== 'string' || configCollection.name.trim() === '') {
    throw new Error(`missing collection name`);
  }

  configCollection.name = configCollection.name.trim();
  configCollection.includeBundledOnly = !!configCollection.includeBundledOnly;

  return configCollection;
}
