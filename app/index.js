require ('./fetch');
require ('./promise');

// function requireAll(r) { r.keys().forEach(r); }
// requireAll(require.context('./modules/', true, /\.js$/));

// Load application styles
import 'material-design-lite/material.min.css';
import 'styles/index.scss';

//import { } from '@fortawesome/fontawesome-pro/js/fontawesome.min'
//import { } from '@fortawesome/fontawesome-pro/js/all.min'

import 'material-design-lite/material.min.js';

import {Preloader} from './preloader';
import { SoundBlaster } from './soundblaster';
import { StageHand } from './stagehand';
import { Leaf } from './plugin_leaf';


let imgReady = false;
let audReady = false;
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
    'assets/images/wall_tile.png',
    'assets/images/comet.png',
    'assets/images/tripod_walk.png',
    'assets/images/tripod_beam.png'
]);

let soundBlaster = new SoundBlaster();


let handleSoundLoaded = function(event){
    console.log('load handler called'); 
    audReady = true;
    StartAudio();
    window.setTimeout(function(){
        if(!audPlaying){
            // Show the play button
            document.getElementById('manplay').classList.add('active');
        }
    }, 1000);
};

let handleSoundTimer = function(event){
    //console.log('time handler called', soundBlaster.GetStreamPosition());

    // Get the time
    let minutes = Math.floor(soundBlaster.GetStreamPosition()/60);
    let seconds = Math.floor(soundBlaster.GetStreamPosition()%60);
    // Add leading zero to seconds
    if(seconds < 10){
        seconds = '0'+seconds;
    }
    // Display the time
    document.querySelector('.clock .time').innerHTML = minutes+":"+seconds;

    // Light up the ACT display
    for( let idx=1; idx < actIdx.length; idx++ ){
        document.querySelector('.act-'+(idx)).classList.remove('active');
        if(soundBlaster.GetStreamPosition() > actIdx[idx-1] && soundBlaster.GetStreamPosition() < actIdx[idx]){
            document.querySelector('.act-'+(idx)).classList.add('active');
        }
    }
    document.querySelector('.act-'+(actIdx.length)).classList.remove('active');
    if(soundBlaster.GetStreamPosition() > actIdx[actIdx.length-1]){
        document.querySelector('.act-'+(actIdx.length)).classList.add('active');
    }

};

let handleSoundEnded = function(event){
    console.log('ended handler called');
    // Loop the broadcast
    soundBlaster.SetStreamPosition(0);
    soundBlaster.PlayStream();
    // Reset the stage hand
    stageHand.Reset();
};

let handleSoundPlay = function(event){
    console.log('play handler called');
    audPlaying = true;
};

function Init(){

    window.fetch('assets/data/script.json').then(function(response){
        //console.log('fetch', response);
        return response.json();
    }).then((data)=>{
        if( !data.acts ){
            throw('act data not found in json')
        }else{
            actIdx = data.acts;
        }
        if( !data.script ){
            throw('script data not found in json')
        }else{
            console.log('[LoadScript]', data);
            // Show the intro panel
            document.querySelector('.panel.one').classList.add('active');
            // Set up the StageHand
            stageHand = new StageHand(data.script, plugins);
            // Load the Audio file
            soundBlaster.LoadStream('broadcast', handleSoundLoaded, handleSoundTimer, handleSoundPlay, handleSoundEnded );
            // Load image files
            preloader.PreloadAssets().then(()=>{
                // TODO: add some sort of check for number of images loaded successfully
                preloader.RenderAssets();
                imgReady = true;
            }).catch((error)=>{
                console.error('[Load Images]',error);
            });
        }

    }).catch((error)=>{
        console.error('[LoadScript]',error);
    });

}

function StartAudio(){
    soundBlaster.SetStreamVolume(0.5); 
    soundBlaster.PlayStream();
    soundBlaster.SetStreamPosition(0);

    // If the manual start button appears, this will be called again.
    // Clear out the timer if it's already going.
    if(tmrIntro !== null){
        window.clearTimeout(tmrIntro);
    }
    tmrIntro = window.setTimeout(function(){
        if(audPlaying && imgReady){
            BeginProduction();
        }else{
            var preloaderPointer = window.setInterval(function(){
                //console.log('tick', preloader.PercentComplete());
                let progress = preloader.PercentComplete();
                if(progress === 100){
                    BeginProduction();
                }else{
                    document.querySelector('.progress .number').innerHTML = progress;
                }
            },2000);
            document.querySelector('.panel.one').classList.remove('active');
            document.querySelector('.panel.one').classList.add('hidden');
            document.querySelector('.panel.two').classList.add('active');
        }
    },1000);
}

function BeginProduction(){
    // Trigger the intro panels to fade out
    document.querySelector('#intro').classList.add('hidden');
    // Stage Heartbeat
    window.setInterval(function(){
        stageHand.Manage(soundBlaster.GetStreamPosition());
    },5000);
}





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


document.querySelector('.btn-action').addEventListener('click',function(){
    document.querySelector('.sidebar').classList.toggle('active');

    console.log('[Action Button]', document.querySelector('.sidebar').classList.contains('active'));

    if( document.querySelector('.sidebar').classList.contains('active') ){
        document.querySelector('.btn-action .material-icons').innerHTML = 'close';
    }else{
        document.querySelector('.btn-action .material-icons').innerHTML = 'menu';
    }
});

document.getElementById('manplay').addEventListener('click', function(){
    StartAudio();
});

document.querySelector('.description .read-more').addEventListener('click',function(){
    document.querySelector('.description').classList.add('more');
});
document.querySelector('.description .read-less').addEventListener('click',function(){
    document.querySelector('.description').classList.remove('more');
});

document.querySelector('.volume').addEventListener('click', function(){
    if( document.querySelector('.volume .material-icons').innerHTML === 'volume_down' ){
        soundBlaster.SetStreamVolume(1);
        document.querySelector('.volume .material-icons').innerHTML = 'volume_up';
    }else if( document.querySelector('.volume .material-icons').innerHTML === 'volume_up' ){
        soundBlaster.SetStreamVolume(0);
        document.querySelector('.volume .material-icons').innerHTML = 'volume_off';
    }else{
        soundBlaster.SetStreamVolume(0.5);
        document.querySelector('.volume .material-icons').innerHTML = 'volume_down';
    }
});

document.querySelector('.playpause').addEventListener('click', function(){
    if( document.querySelector('.playpause .material-icons').innerHTML === 'pause' ){
        soundBlaster.PauseStream();
        document.querySelector('.playpause .material-icons').innerHTML = 'play_arrow';
    }else{
        soundBlaster.PlayStream();
        document.querySelector('.playpause .material-icons').innerHTML = 'pause';
    }
});

document.querySelector('.backward').addEventListener('click',function(){
    soundBlaster.AdvanceStream(true);
});

document.querySelector('.forward').addEventListener('click',function(){
    soundBlaster.AdvanceStream(false);
});

document.querySelector('.skipbackward').addEventListener('click',function(){
    let gotoPos = 0;
    let prevAct = 0;
    for( let act of actIdx ){
        if(soundBlaster.GetStreamPosition() > act+30){
            gotoPos = act;
        }else if(soundBlaster.GetStreamPosition() > act){
            gotoPos = prevAct;
        }
        prevAct = act;
    }
    soundBlaster.SetStreamPosition(gotoPos);
    return;
});

document.querySelector('.skipforward').addEventListener('click',function(){
    for( let act of actIdx ){
        if(act > soundBlaster.GetStreamPosition()){
            soundBlaster.SetStreamPosition(act);
            return;
        }
    }
    soundBlaster.SetStreamPosition(0);
});

window.addEventListener('resize', function(event){
	SetScale();
});

SetScale();
Init();