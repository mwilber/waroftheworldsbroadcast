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
        soundBlaster.SetStreamPosition(150);
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

function SetScale(){
	var tscale = 40;
	var rbottom = 10;
	var wleft = 0;

	var wscale = (window.innerHeight*1.15)/1050;
	if((750*wscale)>(window.innerWidth*0.9)){
		wscale = (window.innerWidth*1.1)/750;
		wleft = -( ((750*wscale)-window.innerWidth) );
		tscale = (window.innerHeight/(1050*wscale))*47.5;
	}

	var rscale = (window.innerHeight*.7)/500;
	if((((450*rscale)+(750*wscale))>window.innerWidth) && ( (500*rscale) < window.innerHeight*.8)){
		rscale = (window.innerHeight*.4)/500;
		rbottom = 10;
	}else if((((450*rscale)+(750*wscale))>window.innerWidth)){
		rscale = (window.innerWidth-(750*wscale))/450;
	}
	
	var rxfrm = 'display:none;';
	if(rscale > 0.2){
		rxfrm = 'display:block; ';
		rxfrm += 'bottom:'+rbottom+'%; ';
		rxfrm += 'transform:scale('+rscale+'); ';
		rxfrm += '-ms-transform:scale('+rscale+'); ';
		rxfrm += '-moz-transform:scale('+rscale+'); ';
		rxfrm += '-webkit-transform:scale('+rscale+'); ';
	}
	document.querySelector('#radio').style.cssText = rxfrm;

	
	var stageCSS = 
		'left:'+wleft+'px; '+
		'transform:scale('+wscale+'); '+
		'-ms-transform:scale('+wscale+'); '+
		'-moz-transform:scale('+wscale+'); '+
        '-webkit-transform:scale('+wscale+'); ';

    console.log('stageframe css', stageCSS);
        
    document.querySelector('#stageframe').style.cssText = stageCSS;

	document.querySelector('#tabletop').style.height = tscale+'%';

}


window.addEventListener('resize', function(event){
	SetScale();
});

SetScale();