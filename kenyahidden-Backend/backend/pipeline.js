/**
 * Runs the scoring/validation pipeline (scripts/run_pipeline.js).
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

export function runPipelineScript() {
  const scriptPath = path.join(REPO_ROOT, 'scripts', 'run_pipeline.js');

  if (!fs.existsSync(scriptPath)) {
    return Promise.reject(new Error(`Missing pipeline script at ${scriptPath}`));
  }

  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [scriptPath], { cwd: REPO_ROOT });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', data => { stdout += data.toString(); });
    proc.stderr.on('data', data => { stderr += data.toString(); });

    proc.on('close', code => {
      if (code !== 0) {
        reject(new Error(stderr.slice(-2000) || `Pipeline exited with code ${code}`));
        return;
      }
      resolve({ stdout: stdout.slice(-2000), stderr: stderr.slice(-2000) });
    });
  });
}
