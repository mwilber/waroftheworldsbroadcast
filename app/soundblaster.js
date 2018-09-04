//  Wrapper for WebAudio API
export class SoundBlaster{
    constructor(){

        this.audioElement = null;
        this.streamContext = null;
        this.streamAnalyzer = null;
        this.meter = null;
        this.audioContext = new AudioContext();
        this.audioSources = {
            'broadcast': {
                src: 'assets/audio/381030.mp3',
                playOnLoad: true,
                loopOnLoad: true,
                preLoad: false
            }
        }

        // Observable from my original Angular service
        // TODO: Implement this in the future
        //public audioLoaded: Subject<string>;
        //this.audioLoaded = new Subject<string>();

        for (const alias of Object.keys(this.audioSources)) {

            if( this.audioSources[alias].preLoad ){
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

    PlayStream(){
        // Play audio element here
        this.streamContext.play();
    }

    PauseStream(){
        this.streamContext.pause();
    }

    AdvanceStream(backward){
        if( typeof backward === 'undefined' ){
            backward = true;
        }
        if(backward){
            this.streamContext.currentTime -= 30;
        }else{
            this.streamContext.currentTime += 30;
        }
    }

    SetStreamVolume(newVol){
        this.streamContext.volume = newVol;
    }

    SetStreamPosition(newTime){
        this.streamContext.currentTime = newTime;
    }

    GetStreamPosition(){
        return this.streamContext.currentTime;
    }

    LoadStream(alias, loadHandler, timeHandler, playHandler, endHandler){
        this.fetchStream(alias)
            .then(function(self){
                return function (result){
                    if(result){
                        self.streamContext = result;
                        let tmpcontext = new AudioContext();
                        self.streamAnalyzer = tmpcontext.createAnalyser();

                        let source = tmpcontext.createMediaElementSource(result);
                        source.connect(self.streamAnalyzer);
                        self.streamAnalyzer.connect(tmpcontext.destination);

                        self.meter = self.createAudioMeter(tmpcontext);
                        source.connect(self.meter);

                        window.setInterval(function(selfb){
                            return function(){
                                console.log(selfb.meter.volume);
                            }
                            
                        }(self), 1000);

                        self.streamContext.addEventListener("loadeddata", loadHandler);
                        self.streamContext.addEventListener("timeupdate", timeHandler);
                        self.streamContext.addEventListener("play", playHandler);
                        self.streamContext.addEventListener("ended", endHandler);
                    }
                }
            }(this))
            .catch(function(error){
                console.log('[SoundBlaster]', 'fetchStream', error);
            });
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

    createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
        var processor = audioContext.createScriptProcessor(512);
        processor.onaudioprocess = this.volumeAudioProcess;
        processor.clipping = false;
        processor.lastClip = 0;
        processor.volume = 0;
        processor.clipLevel = clipLevel || 0.98;
        processor.averaging = averaging || 0.95;
        processor.clipLag = clipLag || 750;
    
        // this will have no effect, since we don't copy the input to the output,
        // but works around a current Chrome bug.
        processor.connect(audioContext.destination);
    
        processor.checkClipping =
            function(){
                if (!this.clipping)
                    return false;
                if ((this.lastClip + this.clipLag) < window.performance.now())
                    this.clipping = false;
                return this.clipping;
            };
    
        processor.shutdown =
            function(){
                this.disconnect();
                this.onaudioprocess = null;
            };
    
        return processor;
    }
    
    volumeAudioProcess( event ) {
        var buf = event.inputBuffer.getChannelData(0);
        var bufLength = buf.length;
        var sum = 0;
        var x;
    
        // Do a root-mean-square on the samples: sum up the squares...
        for (var i=0; i<bufLength; i++) {
            x = buf[i];
            if (Math.abs(x)>=this.clipLevel) {
                this.clipping = true;
                this.lastClip = window.performance.now();
            }
            sum += x * x;
        }
    
        // ... then take the square root of the sum.
        var rms =  Math.sqrt(sum / bufLength);
    
        // Now smooth this out with the averaging factor applied
        // to the previous sample - take the max here because we
        // want "fast attack, slow release."
        this.volume = Math.max(rms, this.volume*this.averaging);
    }
}