import {cp,copyFile,mkdir,rm} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const root=resolve('.'), out=join(root,'dist');
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const name of ['index.html','styles.css','premium.css','app.js','favicon.svg','robots.txt','sitemap.xml','_headers']){
  await copyFile(join(root,name),join(out,name));
}
await cp(join(root,'assets'),join(out,'assets'),{recursive:true});
console.log('Runner\'s Passport static site ready at dist/');
