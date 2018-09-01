export class LoadManager{

    constructor(){

        this.state = {
            'script': {
                status: 'init',
                timer: null,
                data: null
            },
            'audio': {
                status: 'init',
                timer: null,
                data: null
            },
            'images': {
                status: 'init',
                timer: null,
                data: null
            },
        }
    }


    _setState(component, status){
        this.state[component].status = status;
    }

    _getState(component){
        return this.state[component].status;
    }

    _setData(component, data){
        this.state[component].data = data;
    }

    _getData(component){
        return this.state[component].data;
    }


    ///////////////////////////////////////////////////////////////////////////
    // Script
    ///////////////////////////////////////////////////////////////////////////

    LoadScript(){
        return function(self){
            return new Promise(function(resolve, reject){
                window.fetch('assets/data/script.json').then(function(response){
                    //console.log('fetch', response);
                    return response.json();
                })
                .then(function(data){
                    //console.log('fetch data', data);
                    if( !data.acts ){
                        reject('act data not found in json')
                    }
                    if( data.script ){
                        self._setData('script', data);
                        self._setState('script','ready');
                        resolve(self._getData('script'));
                    }else{
                        throw('script data not found in json');
                    }
                })
                .catch(function(error){
                    reject(error);
                });
            });
        }(this);
    }

    ///////////////////////////////////////////////////////////////////////////
    // Audio
    ///////////////////////////////////////////////////////////////////////////

    LoadAudio(timeHandler, endHandler, playHandler){

        return new Promise(function(resolve, reject){

            

        });

    }

    ///////////////////////////////////////////////////////////////////////////
    // Images
    ///////////////////////////////////////////////////////////////////////////

    // LoadImages(){

    //     return new Promise(function(resolve, reject){

    //         var preloaderPointer = window.setInterval(function(){
    //             //console.log('tick', preloader.PercentComplete());
    //         },100);

    //         // tmrIntro = window.setTimeout(function(){
    //         //     tmrIntro = null;
    //         //     if(imgReady){
    //         //         BeginProduction();
    //         //     }
    //         // }, 5000);

    //         preloader.PreloadAssets().then(()=>{
    //             // TODO: add some sort of check for number of images loaded successfully
    //             window.clearInterval(preloaderPointer);
    //             preloader.RenderAssets();
    //             imgReady = true;
    //             resolve(true);
    //             // if(tmrIntro === null){
    //             //     BeginProduction();
    //             // }
    //         }).catch((error)=>{
    //             reject(error);
    //         });

    //     });

    // }

}