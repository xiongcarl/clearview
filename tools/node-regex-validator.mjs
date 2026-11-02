// Build-time adapter for the pinned converter's Node API. GPL-3.0-or-later.
// Its main ESM export defaults to chrome.*; the CLI explicitly installs RE2.
// Match the pinned CLI's 1979-byte budget, then verify emitted rules in Chrome.
import {readFile} from 'node:fs/promises';
export async function configureNodeRegexValidator(){
  const converter=new URL(process.env.AD_SHIELD_CONVERTER || import.meta.resolve('@adguard/dnr-converter'));
  const metadata=JSON.parse(await readFile(new URL('../package.json',converter),'utf8'));
  if(metadata.version!=='2.0.0')throw new Error('Review the Node regex adapter before changing dnr-converter version');
  const {re2Validator}=await import(new URL('./re2-regexp/re2-validator.js',converter).href);
  const re2URL=process.env.AD_SHIELD_DEPENDENCIES?new URL('@adguard/re2-wasm/build/src/re2.js',process.env.AD_SHIELD_DEPENDENCIES).href:import.meta.resolve('@adguard/re2-wasm');
  const {RE2}=await import(re2URL);
  re2Validator.setValidator(async pattern=>{new RE2(pattern,'u',1979);return true;});
}
