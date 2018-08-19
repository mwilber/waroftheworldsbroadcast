require ('./fetch');
require ('./promise');

import 'audio/381030.mp3';
import 'audio/381030.ogg';

// Load application styles
import 'styles/index.scss';

import {Preloader} from './preloader';
import { SoundBlaster } from './soundblaster';

let preloader = new Preloader([
    "assets/images/leaves.png",
]);

let soundBlaster = new SoundBlaster();

var preloaderPointer = window.setInterval(function(){
    //console.log('tick', preloader.PercentComplete());
},100);

preloader.PreloadAssets().then(()=>{
    // TODO: add some sort of check for number of images loaded successfully
    window.clearInterval(preloaderPointer);
    preloader.RenderAssets();

}).catch((error)=>{
    console.error('error loading assets', error);
});


