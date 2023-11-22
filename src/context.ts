import * as os from 'os';
import * as core from '@actions/core';

export const osPlat: string = os.platform();
export const osArch: string = os.arch();

export interface Inputs {
  sourcePath: string;
  ref: string;
}

export async function getInputs(): Promise<Inputs> {
  // target info
  const targetHostname: string = core.getInput('targetPkgRegistryHostname') || "";
  const repository: string = process.env.GITHUB_REPOSITORY || "";
  const repoSplit: string[] = repository.split("/");
  if (repoSplit.length !== 2) {
    // Your code here if the length is not equal to 2
    core.setFailed('args input required');
  }

  const targetPkgNamespace: string = process.env.targetPkgNamespace || repository;
  const targetPkgName: string = process.env.targetPkgName || repoSplit[1];
  const version: string = process.env.GITHUB_REF_NAME || "";
 
  return {
    sourcePath: core.getInput('sourcePkgDir') || 'config',
    ref: `${targetHostname}/${targetPkgNamespace}/${targetPkgName}:${version}`,
  };
}
