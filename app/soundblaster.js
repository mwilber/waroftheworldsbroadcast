//  Wrapper for WebAudio API
export class SoundBlaster{
    constructor(){

        this.audioContext = new AudioContext();
        this.audioSources = {
            'broadcast': {
                src: 'assets/audio/381030.mp3',
                stream: true,
                playOnLoad: true,
                loopOnLoad: true
              }
        }

        // Observable from my original Angular service
        // TODO: Implement this in the future
        //public audioLoaded: Subject<string>;
        //this.audioLoaded = new Subject<string>();

        for (const alias of Object.keys(this.audioSources)) {
            this.fetchSample(alias)
              .then((audioBuffer) => {
                if( this.audioSources[alias].stream ){
                    
                }else{
                    this.audioSources[alias].audioBuffer = audioBuffer;
                    // this.audioSources[alias].loopOnLoad = this.audioSources[alias].loopOnLoad || false;
                    if ( this.audioSources[alias].playOnLoad ) {
                    this.PlaySample(alias, (this.audioSources[alias].loopOnLoad || false));
                    }
                }
                
                //this.audioLoaded.next(alias);
              })
            .catch(error => { throw error; } );
        }

    }

    fetchStream(alias) {

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