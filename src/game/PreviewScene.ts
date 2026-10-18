import Phaser from 'phaser';
/** Technical engine test only; never substitute primitive shapes for final art. */
export class PreviewScene extends Phaser.Scene {
 constructor(){super('PreviewScene')}
 create(){const w=this.scale.width,h=this.scale.height;
 this.cameras.main.setBackgroundColor('#153e4c');
 this.add.text(w/2,h*.37,'GÜVENKENT',{fontFamily:'Arial',fontSize:'52px',fontStyle:'bold',color:'#f8dfad'}).setOrigin(.5);
 this.add.text(w/2,h*.53,'Oyun motoru çalışıyor. Şehir görselleri hazırlanıyor.',{fontFamily:'Arial',fontSize:'18px',color:'#ffffff',align:'center'}).setOrigin(.5);
 this.add.text(w/2,h*.74,'TEKNİK ÖNİZLEME — nihai oyun sahnesi değil',{fontFamily:'Arial',fontSize:'14px',color:'#b0dddf'}).setOrigin(.5);
 }
}
