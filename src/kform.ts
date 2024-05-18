import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as core from '@actions/core'
import * as context from './context';
import * as tc from '@actions/tool-cache';

export async function install(version: string): Promise<string> {
    const filename = getFilename();
    const downloadUrl = util.format(
      'https://github.com/kform-tools/kformpkg/releases/download/%s/%s',
      version,
      filename
    );
  
    core.info(`Downloading ${downloadUrl}`);
    const downloadPath: string = await tc.downloadTool(downloadUrl);
    core.debug(`Downloaded to ${downloadPath}`);
  
    core.info('Extracting kformpkg');
    let extPath: string;
    if (context.osPlat == 'win32') {
      if (!downloadPath.endsWith('.zip')) {
        const newPath = downloadPath + '.zip';
        fs.renameSync(downloadPath, newPath);
        extPath = await tc.extractZip(newPath);
      } else {
        extPath = await tc.extractZip(downloadPath);
      }
    } else {
      extPath = await tc.extractTar(downloadPath);
    }
    core.debug(`Extracted to ${extPath}`);
  
    const cachePath: string = await tc.cacheDir(extPath, 'kformpkg-action', version);
    core.debug(`Cached to ${cachePath}`);
  
    const exePath: string = path.join(cachePath, context.osPlat == 'win32' ? 'kformpkg.exe' : 'kformpkg');
    core.debug(`Exe path is ${exePath}`);
  
    return exePath;
  }

  const getFilename = (): string => {
    let arch: string;
    switch (context.osArch) {
      case 'x64': {
        arch = 'x86_64';
        break;
      }
      case 'x32': {
        arch = 'i386';
        break;
      }
      case 'arm': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arm_version = (process.config.variables as any).arm_version;
        arch = arm_version ? 'armv' + arm_version : 'arm';
        break;
      }
      default: {
        arch = context.osArch;
        break;
      }
    }
    if (context.osPlat == 'darwin') {
      arch = 'all';
    }
    const platform: string = context.osPlat == 'win32' ? 'Windows' : context.osPlat == 'darwin' ? 'Darwin' : 'Linux';
    const ext: string = context.osPlat == 'win32' ? 'zip' : 'tar.gz';
    return util.format('kformpkg_%s_%s.%s', platform, arch, ext);
  };
