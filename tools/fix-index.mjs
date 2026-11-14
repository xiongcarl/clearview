// data/engine/fix-keys.bin: which list keys (hostnames, or entities such as example.*) have site
// fixes. The worker reads it on its first navigation after every wake-up, so it is a sorted array
// of 32-bit key hashes rather than JSON: nothing to parse, and a fifth of the size.
// Layout, little-endian uint32: shard count, key count, then the hashes in ascending order.
// A key's shard (fixes/data-N.js) is its hash modulo the shard count, as in build-advanced.mjs.
// Two keys sharing a hash would register one fix file for a site without fixes; the file then
// finds no entry for that host and does nothing.
export const fixHash=key=>{let hash=0x811c9dc5;for(let i=0;i<key.length;i++){hash^=key.charCodeAt(i);hash=Math.imul(hash,16777619);}return hash>>>0;};
export function encodeFixIndex(keys,shards){
  const hashes=[...new Set(keys.map(fixHash))].sort((a,b)=>a-b);
  const view=new DataView(new ArrayBuffer(8+hashes.length*4));
  view.setUint32(0,shards,true);view.setUint32(4,hashes.length,true);
  hashes.forEach((hash,i)=>view.setUint32(8+i*4,hash,true));
  return new Uint8Array(view.buffer);
}
