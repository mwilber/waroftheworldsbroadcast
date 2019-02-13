require ('./fetch');
require ('./promise');

// function requireAll(r) { r.keys().forEach(r); }
// requireAll(require.context('./modules/', true, /\.js$/));

// Load application styles
//import 'styles/app-shell.scss'; // TODO: Remove this before production
import 'styles/main.scss';

//import { } from '@fortawesome/fontawesome-pro/js/fontawesome.min'
//import { } from '@fortawesome/fontawesome-pro/js/all.min'

import 'material-design-lite/material.min.js';

import {Preloader} from './preloader';
import { SoundBlaster } from './soundblaster';
import { StageHand } from './stagehand';
import { Leaf } from './plugin_leaf';
import { SocialShare } from './socialshare';


let socialShare = new SocialShare();

let imgReady = false;
let audReady = false;
let audPlaying = false;
let historicalTime = true;

let startPos = 140;

var ctShowLoader = 0;
var tmrLoader = null;

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
    'assets/images/tripod_beam.png',
    'assets/images/zeta-o-lantern.png',
    'assets/images/wood_surface.jpg',
    'assets/images/starfield.png'
]);

let soundBlaster = new SoundBlaster();


let handleSoundLoaded = function(event){
    console.log('load handler called'); 
    audReady = true;
    //StartAudio();
    document.getElementById('intro').classList.add('manplay');
            document.querySelector('.tuner').classList.add('active');
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
    if( historicalTime ){
        if(minutes < 10){
            minutes = '0'+minutes;
        }
        document.querySelector('.clock .time').innerHTML = "8:"+minutes+"pm";
    }else{
        document.querySelector('.clock .time').innerHTML = minutes+":"+seconds;
    }

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

    // background-color: #f3e26c;
    // background-color: #ffd400;
    // background-color: #ffeb59;
    // background-color: #ca8331;

    var candleColors = [
        '#f3e26c',
        '#ffd400',
        '#ffeb59',
        '#b59d29'
    ];
    var candleColorChance = Math.floor(Math.random()*4);

    document.querySelector('#pumpkin .candle').style.backgroundColor = candleColors[candleColorChance];
    //document.querySelector('#pumpkin .candle').style.backgroundColor = "#543b1e";

};

let handleSoundEnded = function(event){
    console.log('ended handler called');
    // Loop the broadcast
    SetAudioPosition(0);
    soundBlaster.PlayStream();
    // Reset the stage hand
    stageHand.Reset();
};

let handleSoundPlay = function(event){
    console.log('play handler called');
    audPlaying = true;
};

function Init(){

    // Start at a random time between 2:20 - 3:30
    startPos = 140 + Math.floor(Math.random()*70);

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
            tmrLoader = window.setInterval(WatchLoad,1000);
        }

    }).catch((error)=>{
        console.error('[LoadScript]',error);
    });

}

function WatchLoad(){
    
    //console.log('[WatchLoad]', audPlaying, ctShowLoader);
    ctShowLoader++;

    //console.log('tick', preloader.PercentComplete());
    let progress = preloader.PercentComplete();
    document.querySelector('.progress .number').innerHTML = progress;
    document.querySelector('.progress-bar').style.width = progress+"%";
    
    if(audPlaying && imgReady){
        window.clearInterval(tmrLoader);
        document.querySelector('.progress-bar').style.width = "100%";
        BeginProduction(); 
    }else if(audPlaying && ctShowLoader > 5){
        if(!document.getElementById('loader').classList.contains('active')){
            document.getElementById('loader').classList.add('active');
        }
    }
}

function StartAudio(){
    soundBlaster.SetStreamVolume(0.5); 
    soundBlaster.PlayStream();
    document.querySelector('.playpause .material-icons').innerHTML = 'pause';
    console.log('Starting audio at:', startPos);
    SetAudioPosition(startPos);

    document.getElementById('intro').classList.remove('manplay');
    window.setTimeout(function(){
        if(!audPlaying){
            // Show the play button
            document.getElementById('intro').classList.add('manplay');
            document.querySelector('.tuner').classList.add('active');
        }
    }, 1000);
}

function BeginProduction(){
    // Trigger the intro panels to fade out
    document.querySelector('.silhouette').classList.add('active');
    document.getElementById('the-room').classList.add('active');
    // Stage Heartbeat
    window.setInterval(function(){
        stageHand.Manage(soundBlaster.GetStreamPosition());
    },5000);
}

function SetAudioPosition(pPos){
    soundBlaster.SetStreamPosition(pPos);
    stageHand.ResetQueue();
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
    var pxfrm = 'display:none;';
	if(rscale > 0.2){
		rxfrm = 'display:block; ';
		rxfrm += 'bottom:'+rbottom+'%; ';
		rxfrm += 'transform:scale('+rscale+'); ';
		rxfrm += '-moz-transform:scale('+rscale+'); ';
        rxfrm += '-webkit-transform:scale('+rscale+'); ';
        
        pxfrm = ' ';
        pxfrm += 'transform:scale('+rscale+'); ';
		pxfrm += '-moz-transform:scale('+rscale+'); ';
		pxfrm += '-webkit-transform:scale('+rscale+'); ';
	}
    document.querySelector('#radio').style.cssText = rxfrm;
    //document.querySelector('#pumpkin').style.cssText = pxfrm;

	
	var stageCSS = 
		'left:'+wleft+'px; '+
		'transform:scale('+wscale+'); '+
		'-moz-transform:scale('+wscale+'); '+
        '-webkit-transform:scale('+wscale+'); ';

    console.log('stageframe css', stageCSS);
        
    document.querySelector('#stageframe').style.cssText = stageCSS;

	document.querySelector('#tabletop').style.height = tscale+'%';

}

//////////////////////////////////////////////////////////////////////////////////////
// Event handlers
//////////////////////////////////////////////////////////////////////////////////////

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        if( true ){
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        }else{
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {  
                    registration.unregister();
                }
            });
        }
    });
}


document.getElementById('manplay').addEventListener('click', function(){
    //soundBlaster.PlayStream();
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
        document.getElementById('intro').classList.remove('manplay');
        document.querySelector('.tuner').classList.remove('active');
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
    SetAudioPosition(gotoPos);
    return;
});

document.querySelector('.skipforward').addEventListener('click',function(){
    for( let act of actIdx ){
        if(act > soundBlaster.GetStreamPosition()){
            SetAudioPosition(act);
            return;
        }
    }
    SetAudioPosition(0);
});

document.querySelector('.btn-clock').addEventListener('click', function(){
    console.log('clock', 'click');
    historicalTime = !historicalTime;
});

document.querySelector('.act-1').addEventListener('click',function(){
    console.log('act-1', 'click');
    SetAudioPosition(actIdx[0]);
});

document.querySelector('.act-2').addEventListener('click',function(){
    console.log('act-2', 'click');
    SetAudioPosition(actIdx[1]);
});

document.querySelector('.act-3').addEventListener('click',function(){
    console.log('act-3', 'click');
    SetAudioPosition(actIdx[2]);
});

document.querySelector('.share.fb').addEventListener('click',function(){
    socialShare.fbshare(shareMeta.title, shareMeta.link, shareMeta.image, shareMeta.description);
});
document.querySelector('.share.tw').addEventListener('click',function(){
    socialShare.twshare(shareMeta.title, shareMeta.link, shareMeta.description);
});
document.querySelector('.share.pn').addEventListener('click',function(){
    socialShare.pnshare(shareMeta.title, shareMeta.link, shareMeta.image, shareMeta.description);
});
document.querySelector('.share.gp').addEventListener('click',function(){
    socialShare.gpshare(shareMeta.link);
});

window.addEventListener('resize', function(event){
	SetScale();
});

SetScale();
Init();