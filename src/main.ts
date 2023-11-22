import * as core from '@actions/core'
import * as context from './context';

async function run(): Promise<void> {
  try {
    const inputs: context.Inputs = await context.getInputs();
    console.log(`${inputs.sourcePath}`);
    console.log(`${inputs.ref}`);
    //console.log(`inputs: sourcePath=${inputs.sourcePath}, ref=${inputs.ref}!`);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  } 
}

run()