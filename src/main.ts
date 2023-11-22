import * as core from '@actions/core'
import * as context from './context';
import * as kform from './kform';

async function run(): Promise<void> {
  try {
    const inputs: context.Inputs = await context.getInputs();
    console.log(`version: ${inputs.version}`);
    console.log(`sourcePath: ${inputs.sourcePath}`);
    console.log(`ref: ${inputs.ref}`);
    
    const bin = await kform.install(inputs.version);
    core.info(`kform ${inputs.version} installed successfully`);

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  } 
}

run()