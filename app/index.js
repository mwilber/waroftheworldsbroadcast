require ('./fetch');
require ('./promise');

// function requireAll(r) { r.keys().forEach(r); }
// requireAll(require.context('./modules/', true, /\.js$/));

// Load application styles
import 'styles/index.scss';

import {Preloader} from './preloader';
import { SoundBlaster } from './soundblaster';
import { StageHand } from './stagehand';

let stageHand = null;
let actIdx = [];

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
        soundBlaster.SetStreamPosition(3553);
    },
    function(event){
        //console.log('time handler called', soundBlaster.GetStreamPosition());
        if( soundBlaster.GetStreamPosition() > 150 ){

        }
    },
    function(event){
        console.log('play handler called');
    },
    function(event){
        console.log('ended handler called');
        // Loop the broadcast
        soundBlaster.SetStreamPosition(0);
        soundBlaster.PlayStream();
        // Reset the stage hand
        stageHand.Reset();
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

window.fetch('assets/data/script.json').then(function(response){
    //console.log('fetch', response);
    return response.json();
})
.then(function(data){
    console.log('fetch data', data);
    if( data.acts ){
        actIdx = data.acts;
    }else{
        console.warn('act data not found in json')
    }
    if( data.script ){
        stageHand = new StageHand(data.script);
        window.setInterval(function(){
            stageHand.Manage(soundBlaster.GetStreamPosition());
        },5000);
    }else{
        throw('script data not found in json');
    }
})
.catch(function(error){
    console.error('fetch failed:', error);
});