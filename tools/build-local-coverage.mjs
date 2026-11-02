// Explicit advertisement paths and labels; no score/status manipulation.
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const source=JSON.parse(await readFile(new URL('data/local-coverage.json',root),'utf8'));
await writeFile(new URL('data/local-rules.json',root),JSON.stringify(source.network.map((condition,i)=>({id:i+1,priority:90,action:{type:'block'},condition})))+'\n');
