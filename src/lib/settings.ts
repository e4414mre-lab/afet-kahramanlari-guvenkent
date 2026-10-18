export type Settings = {voice:boolean;text:boolean;ambience:boolean;music:boolean;effects:boolean;reducedMotion:boolean};
export const DEFAULT_SETTINGS:Settings={voice:true,text:true,ambience:true,music:true,effects:true,reducedMotion:false};
const key='guvenkent-settings-v1';
export function loadSettings():Settings {try{return {...DEFAULT_SETTINGS,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{return {...DEFAULT_SETTINGS}}}
export function saveSettings(settings:Settings){try{localStorage.setItem(key,JSON.stringify(settings))}catch{/* private browsing */}}
