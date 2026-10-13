import {cp,copyFile,mkdir,rm} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const root=resolve('.'), out=join(root,'dist');
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const name of ['index.html','studio.html','editorial.css','editorial.js','studio-polish.css','styles.css','premium.css','atelier.css','experience.css','app.js','atelier.js','experience.js','favicon.svg','robots.txt','sitemap.xml','_headers']){
  await copyFile(join(root,name),join(out,name));
}
await cp(join(root,'assets'),join(out,'assets'),{recursive:true});
console.log('Runner\'s Passport static site ready at dist/');
