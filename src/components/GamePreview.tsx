import {useEffect,useRef} from 'react';
import Phaser from 'phaser';
import {PreviewScene} from '../game/PreviewScene';
export function GamePreview(){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{if(!ref.current)return;const g=new Phaser.Game({type:Phaser.AUTO,parent:ref.current,width:960,height:540,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[PreviewScene]});return()=>{g.destroy(true)}},[]);return <div ref={ref} className="preview" aria-label="Phaser teknik sahne önizlemesi"/>}
