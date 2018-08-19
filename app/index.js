require ('./fetch');
require ('./promise');

// Load application styles
import 'styles/index.scss';

import {Preloader} from './preloader';

let preloader = new Preloader([
    // "assets/Comet0000.png",
    // "assets/Comet0001.png",
    // "assets/Comet0002.png",
    // "assets/Comet0003.png",
    // "assets/Comet0004.png",
    // "assets/Comet0005.png",
    // "assets/Comet0006.png",
    // "assets/Comet0007.png",
    // "assets/Comet0008.png",
    // "assets/Comet0009.png",
    // "assets/Comet0010.png",
    // "assets/Comet0011.png",
    // "assets/Comet0012.png",
    // "assets/Comet0013.png",
    // "assets/Comet0014.png",
    // "assets/Comet0015.png",
    // "assets/Comet0016.png",
    // "assets/Comet0017.png",
    // "assets/Tripod0001.png",
    // "assets/Tripod0002.png",
    // "assets/Tripod0003.png",
    // "assets/Tripod0004.png",
    // "assets/Tripod0005.png",
    // "assets/Tripod0006.png",
    // "assets/Tripod0007.png",
    // "assets/Tripod0008.png",
    // "assets/Tripod0009.png",
    // "assets/Tripod0010.png",
    // "assets/Tripod0011.png",
    // "assets/Tripod0012.png",
    // "assets/Tripod0013.png",
    // "assets/Tripod0014.png",
    // "assets/Tripod0015.png",
    // "assets/Tripod0016.png",
    // "assets/Tripod0017.png",
    // "assets/Tripod0018.png",
    // "assets/Tripod0019.png",
    // "assets/Tripod0020.png",
    "assets/images/leaves.png",
]);

var preloaderPointer = window.setInterval(function(){
    //console.log('tick', preloader.PercentComplete());
},100);

preloader.PreloadAssets().then(()=>{
    // TODO: add some sort of check for number of images loaded successfully
    window.clearInterval(preloaderPointer);
    preloader.RenderAssets();

}).catch((error)=>{
    console.error('error loading assets', error);
});

