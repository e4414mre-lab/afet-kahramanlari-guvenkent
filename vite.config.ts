import {defineConfig,loadEnv} from 'vite';
import {practiceMiddleware} from './server/practice';
export default defineConfig(({mode})=>{
 const vars=loadEnv(mode,process.cwd(),'VITE_'),key=vars.VITE_SUPABASE_ANON_KEY??'';
 let publicKey=!key||key.startsWith('sb_publishable_');
 if(key&&!publicKey){try{publicKey=JSON.parse(Buffer.from(key.split('.')[1]??'','base64url').toString()).role==='anon'}catch{publicKey=false}}
 // Reject a misplaced secret BEFORE Vite can inline it in browser JavaScript.
 if(!publicKey)throw new Error('VITE_SUPABASE_ANON_KEY yalnız anon/publishable anahtar içerebilir. Gizli anahtarı sunucu platformunda sakla.');
 return {server:{host:'0.0.0.0',fs:{deny:['.env','.env.*','*.{crt,pem}','**/.git/**','**/node_modules/.vite-temp/**','**/vite.config.*','**/server/**','**/supabase/**','**/docs/data/**','**/src/data/finalAssessment.ts','**/src/game/finalAssessmentFlow.ts']}},plugins:[{name:'guvenkent-trusted-practice',configureServer(server){server.middlewares.use(practiceMiddleware)},configurePreviewServer(server){server.middlewares.use(practiceMiddleware)}}]};
});
