export class Preloader{

    constructor(){
        // List of nodes with data-cache property
        this.assets = document.querySelectorAll('[data-cache]');
        // List of urls of assets loaded
        this.loadedAssets = [];

        //for( let asset of this.assets ){
        //    console.log(asset.dataset.cache);
        //}

        // Preload Images
        //this.PreloadAssets();
    }

    PreloadAssets(){
        return this._preloadAssets(this.assets, this.loadedAssets, this._loadImage);
    }

    _preloadAssets(assets, loadedAssets, _loadImage){
        return new Promise(function(resolve, reject){
            let assetPromises = [];
            try{
                for( let asset of assets ){
                    // TODO: Add support for other asset types (audio)
                    if(asset.tagName.toLowerCase() === 'img'){
                        assetPromises.push(_loadImage(asset.dataset.cache, loadedAssets));
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