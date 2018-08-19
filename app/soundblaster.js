//  Wrapper for WebAudio API
export class SoundBlaster{
    constructor(){

        this.streamContext = null;
        this.audioContext = new AudioContext();
        this.audioSources = {
            'broadcast': {
                src: 'assets/audio/381030.mp3',
                stream: true,
              }
        }

        // Observable from my original Angular service
        // TODO: Implement this in the future
        //public audioLoaded: Subject<string>;
        //this.audioLoaded = new Subject<string>();

        for (const alias of Object.keys(this.audioSources)) {

            if( this.audioSources[alias].stream ){
                    
                this.fetchStream(alias)
                .then(function(self){
                    return function (result){
                        if(result){
                            self.streamContext = result;
                            //Play audio element here
                            self.streamContext.play();
                        }
                    }
                }(this))
                .catch(function(error){
                    console.log('[SoundBlaster]', 'fetchStream', error);
                });
        
                // broadcast.addEventListener("play", function(){
                //     isPlaying = true;
                // });
                
                // broadcast.addEventListener("loadeddata", function(){
                //     tmrTripod = setInterval(handleTimeEvents, tripodInterval);
                //     DebugOut("can play: "+broadcast.duration);
                //     DebugOut('loaded data');
                //     startCk = 2;
                //     if( isWidget ) this.volume = 0.1;
                //     this.play();
                //     setTimeout(function(){
                //         if(!isPlaying){
                //             $('#introbox').show();
                //         }
                //     },1000);
                    
                // });
                
                // broadcast.addEventListener("loadedmetadata", function(){
                //     DebugOut('loaded meta');
                //     if( isNumber(hash) ){
                //         this.currentTime = hash;
                //     }else if(isWidget){
                //         broadcast.currentTime = acts[1]+Math.floor(Math.random()*100)+100;
                //     }else{
                //            this.currentTime = Math.floor(Math.random()*300)+300;
                //        }
                // });
                
                // broadcast.addEventListener("ended", function(e){
                //     this.currentTime = 0;
                //     this.play();
                // }, false);
                
            }else{
                this.fetchSample(alias)
                .then((audioBuffer) => {
                    
                        this.audioSources[alias].audioBuffer = audioBuffer;
                        // this.audioSources[alias].loopOnLoad = this.audioSources[alias].loopOnLoad || false;
                        if ( this.audioSources[alias].playOnLoad ) {
                        this.PlaySample(alias, (this.audioSources[alias].loopOnLoad || false));
                        }
                    
                    //this.audioLoaded.next(alias);
                })
                .catch(error => { throw error; } );
            }
        }

    }

    fetchStream(alias) {
        return function(self){
            return new Promise(function(resolve, reject){
                let streamRef = new Audio();
                if (streamRef.canPlayType('audio/mpeg;')) {
                    streamRef.type= 'audio/mpeg';
                    streamRef.src= self.audioSources[alias].src;
                } else {
                    reject('env cannot play mp3 format');
                }
    
                streamRef.load();//suspends and restores all audio element
                resolve(streamRef);
            });
        }(this);
    }
  
    fetchSample(alias) {
      console.log('[SoundBlaster]','fetching audio', alias);
      return fetch(this.audioSources[alias].src)
          .then(response => response.arrayBuffer())
          .then(buffer => {
              return new Promise((resolve, reject) => {
                  this.audioContext.decodeAudioData(
                      buffer,
                      resolve,
                      reject
                  );
              });
          });
    }
  
    PlaySample(alias, loop) {
      console.log('[SoundBlaster]','playing sample', alias);
      loop = loop || false;
      this.audioSources[alias].bufferSource = this.audioContext.createBufferSource();
      this.audioSources[alias].bufferSource.buffer = this.audioSources[alias].audioBuffer;
      this.audioSources[alias].bufferSource.connect(this.audioContext.destination);
      this.audioSources[alias].bufferSource.loop = loop;
      this.audioSources[alias].bufferSource.start(0);
    }
  
    ChangeTempo(alias, tempo) {
      console.log('[SoundBlaster]','TEMPO CHANGE', alias, tempo);
      this.audioSources[alias].bufferSource.playbackRate.value = tempo;
    }
  
    StopLoop(alias) {
      this.audioSources[alias].bufferSource.loop = false;
    }
}