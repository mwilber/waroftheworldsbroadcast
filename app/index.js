// Load application styles
import 'styles/index.scss';

import {Preloader} from './preloader';

let preloader = new Preloader();

preloader.PreloadAssets().then(()=>{
    // TODO: add some sort of check for number of images loaded successfully
    preloader.RenderAssets();

}).catch((error)=>{
    console.error('error loading assets', error);
});
