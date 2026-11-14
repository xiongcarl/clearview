// The worker's fix index (data/engine/fix-keys.bin) must name exactly the keys the fix data
// files hold, each in its own file, and nothing else.
import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import vm from 'node:vm';
const root=new URL('../extension/',import.meta.url);
// Run the worker's own loader, not a copy of it.
const source=await readFile(new URL('background.js',root),'utf8');
const loader=source.match(/const loadFixIndex=\(\)=>fixIndex \|\|= ([\s\S]*?\n\}\);)/);assert.ok(loader,'loader found in background.js');
const bin=await readFile(new URL('data/engine/fix-keys.bin',root));
const context=vm.createContext({fetch:async()=>({arrayBuffer:async()=>bin.buffer.slice(bin.byteOffset,bin.byteOffset+bin.byteLength)}),chrome:{runtime:{getURL:x=>x}},DataView,Uint32Array});
const index=await vm.runInContext('('+loader[1].replace(/;$/,'')+')',context);
let keys=0;const all=new Set();
for(let shard=0;shard<32;shard++){
  const text=await readFile(new URL(`fixes/data-${shard}.js`,root),'utf8');
  // The data file calls the library's entry point with (keys, records); capture the keys.
  let held;const sandbox=vm.createContext({});sandbox.globalThis=sandbox;sandbox.__clearviewFixes=keys=>{held=keys;};
  vm.runInContext(text,sandbox);assert.ok(held,`data-${shard}.js calls the entry point`);
  for(const key of Object.keys(held)){assert.equal(index.shard(key),shard,`${key} is in data-${shard}.js`);keys++;all.add(key);}
}
assert.equal(index.size,keys,'the index holds every key once');
let misses=0;for(let i=0;i<200000;i++){const key=`no-such-site-${i}.example`;if(!all.has(key) && index.shard(key)!==undefined)misses++;}
assert.ok(misses<=2,`unknown hosts are not in the index (${misses} of 200000 collided)`);
for(const key of ['www.youtube.com','youtube.com'])assert.ok(all.has(key)===(index.shard(key)!==undefined),key);
console.log(`Fix index checks passed (${keys} keys, ${misses} chance collisions in 200000 unknown hosts).`);
