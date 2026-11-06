import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildRuntime } from './build-runtime.mjs';

// Public pages use the consolidated V18 system. Preserve legacy editor geometry
// in its own bundle, so visitors no longer download every CMS/version override.
const bundles={
  'site.css':['fonts.css','design-system.css','contact-media.css','company-locations.css',
    'ui-foundation.css','ui-navigation.css','ui-home.css','ui-jobs.css',
    'ui-detail.css','ui-services.css','ui-editorial.css'],
  'cms.css':['fonts.css','styles.css','flagship-v12.css','flagship-v13.css','flagship-v14.css','flagship-v15.css','prototype-v16.css','prototype-v17.css','cms-theme.css','contact-media.css','company-profile.css'],
};
const outputDirectory = path.resolve(process.env.MD_STATIC_OUTPUT_DIR || 'public');
for(const [output,styles] of Object.entries(bundles)){
  const css=styles.map(file=>`/* ${file} */\n`+fs.readFileSync('public/'+file,'utf8')).join('\n');
  fs.writeFileSync(path.join(outputDirectory,output),css);
}
console.log('Public runtime:',JSON.stringify(await buildRuntime({ minify: !process.argv.includes('--unminified'), outputDirectory })));
execFileSync(process.execPath,['scripts/prerender.mjs'],{stdio:'inherit'});
// Evaluator reports live under docs/, outside the prototype presentation UI.
