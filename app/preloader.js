export class Preloader{

    constructor(addlassets){
        // List of nodes with data-cache property
        this.assets = Array.prototype.slice.call(document.querySelectorAll('[data-cache]'));

        // Add in the additional assets
        if( typeof addEventListener !== 'undefined' ){
            for( let addlasset of addlassets ){
                let tmp = document.createElement('img');
                tmp.dataset['cache'] = addlasset;
                tmp.dataset['render'] = 'false';
                this.assets.push(tmp);
            }
        }

        // List of urls of assets loaded
        this.loadedAssets = [];

        // Percent complete for display
        this.percentComplete = 0;
    }

    PreloadAssets(){
        return function(self){
            return new Promise(function(resolve, reject){
                let assetPromises = [];
                try{
                    console.log(self.assets);
                    for( let asset of self.assets ){
                        // TODO: Add support for other asset types (audio)
                        if(asset.dataset.cache.indexOf('png') > -1 ||
                            asset.dataset.cache.indexOf('jpg') > -1){
                            assetPromises.push(self._loadImage(asset.dataset.cache, self.loadedAssets).then(()=>{self._updatePercentComplete()}));
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
            this._renderAsset(asset);
        }
    }

    _renderAsset(node){
        if(typeof node.dataset.render !== 'undefined'){
            if( node.dataset.render === 'false'){
                return;
            }
        }

        //TODO: Add support for other element types
        if(node.tagName.toLowerCase() === 'img'){
            node.src = node.dataset.cache;
            
        }
    }

    PercentComplete(){
        return Math.floor(this.percentComplete*100);
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

    _updatePercentComplete(){
        this.percentComplete = (this.loadedAssets.length/this.assets.length);
    }
}