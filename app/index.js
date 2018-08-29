require ('./fetch');
require ('./promise');

// function requireAll(r) { r.keys().forEach(r); }
// requireAll(require.context('./modules/', true, /\.js$/));

// Load application styles
import 'styles/index.scss';

import {Preloader} from './preloader';
import { SoundBlaster } from './soundblaster';
import { StageHand } from './stagehand';
import { Leaf } from './plugin_leaf';

let imgReady = false;
let audReady = false;
let scrReady = false;
let audPlaying = false;

let tmrIntro = null;

let stageHand = null;
let actIdx = [];

var plugins = {
    "leaf": new Leaf(document.querySelector('#plants'))
};

let preloader = new Preloader([
    'assets/images/car1.png',
    'assets/images/car2.png',
    'assets/images/leaves.png',
]);

let soundBlaster = new SoundBlaster();

///////////////////////////////////////////////////////////////////////////
// Audio
///////////////////////////////////////////////////////////////////////////

function InitAudio(){

    soundBlaster.LoadStream('broadcast',
        function(event){
            console.log('load handler called'); 
            audReady = true;
            StartAudio();
            tmrIntro = window.setTimeout(function(){
                if(!audPlaying){
                    // Show the play button
                    document.getElementById('manplay').classList.add('active');
                }
            }, 5000);
        },
        function(event){
            //console.log('time handler called', soundBlaster.GetStreamPosition());
            if( soundBlaster.GetStreamPosition() > 150 ){

            }
        },
        function(event){
            console.log('play handler called');
            audPlaying = true;
            
            if( !imgReady ){
                tmrIntro = window.setTimeout(function(){
                    // Load the images here
                    document.querySelector('.panel.one').classList.remove('active');
                    document.querySelector('.panel.one').classList.add('hidden');
                    document.querySelector('.panel.two').classList.add('active');
                    InitImages();
                },5000);
            }
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

}

document.getElementById('manplay').addEventListener('click', function(){
    StartAudio();
})

function StartAudio(){
    soundBlaster.SetStreamVolume(0.1); 
    soundBlaster.PlayStream();
    soundBlaster.SetStreamPosition(150);
}

///////////////////////////////////////////////////////////////////////////
// Images
///////////////////////////////////////////////////////////////////////////

function InitImages(){

    var preloaderPointer = window.setInterval(function(){
        //console.log('tick', preloader.PercentComplete());
    },100);

    tmrIntro = window.setTimeout(function(){
        tmrIntro = null;
        if(imgReady){
            BeginProduction();
        }
    }, 5000);

    preloader.PreloadAssets().then(()=>{
        // TODO: add some sort of check for number of images loaded successfully
        window.clearInterval(preloaderPointer);
        preloader.RenderAssets();
        imgReady = true;
        if(tmrIntro === null){
            BeginProduction();
        }
    }).catch((error)=>{
        console.error('error loading assets', error);
    });

}

function BeginProduction(){
    document.querySelector('#intro').classList.add('hidden');

    window.setInterval(function(){
        stageHand.Manage(soundBlaster.GetStreamPosition());
    },5000);
}

///////////////////////////////////////////////////////////////////////////
// Script
///////////////////////////////////////////////////////////////////////////

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
        stageHand = new StageHand(data.script, plugins);
        scrReady = true;
        // Display first panel
        document.querySelector('.panel.one').classList.add('active');
        // Fetch audio
        InitAudio();
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