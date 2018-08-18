export class Preloader{

    constructor(){
        // List of nodes with data-cache property
        this.assets = document.querySelectorAll('[data-cache]');
        // List of urls of assets loaded
        this.loadedAssets = [];
    }

    PreloadAssets(){
        return function(self){
            return new Promise(function(resolve, reject){
                let assetPromises = [];
                try{
                    for( let asset of self.assets ){
                        // TODO: Add support for other asset types (audio)
                        if(asset.tagName.toLowerCase() === 'img'){
                            assetPromises.push(self._loadImage(asset.dataset.cache, self.loadedAssets));
                        }
                    }
                }catch(error){
                    reject(error);
                }
    
                Promise.all(assetPromises).then(()=>{
                    //console.log('all promises resolved. resolve here.',this.loadedAssets);
                    resolve(true);
                });
    
            });
        }(this);
    }

    RenderAssets(){
        for( let asset of this.assets ){
            //TODO: Add support for other element types
            if(asset.tagName.toLowerCase() === 'img'){
                asset.src = asset.dataset.cache;
                
            }
        }
    }

    _loadImage(src, loadedref) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                console.log('[preloader] loaded: '+src);
                loadedref.push(src);
                resolve(src);
            };
            img.onerror = function () {
                console.error('[preloader] failed: ' + src);
                resolve(src);
            };
            img.src = src;
        });
    }
}