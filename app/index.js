require ('./fetch');
require ('./promise');

// Load application styles
import 'styles/index.scss';

import {Preloader} from './preloader';
import { SoundBlaster } from './soundblaster';

let preloader = new Preloader([
    'assets/images/car1.png',
    'assets/images/car2.png',
    'assets/images/leaves.png',
]);

let soundBlaster = new SoundBlaster();

soundBlaster.LoadStream('broadcast',
    function(event){
        console.log('load handler called'); 
        soundBlaster.SetStreamVolume(0.1); 
        soundBlaster.PlayStream();
        soundBlaster.SetStreamPosition(100);
    },
    function(event){
        //console.log('time handler called', soundBlaster.GetStreamPosition());
    },
    function(event){
        console.log('play handler called');
    },
    function(event){
        console.log('ended handler called');
        // Loop the broadcast
        soundBlaster.SetStreamPosition(0);
        soundBlaster.PlayStream();
    }
);

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


