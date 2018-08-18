/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

import {Preloader} from './preloader';

let preloader = new Preloader();

preloader.PreloadAssets(document.querySelectorAll('[data-cache]')).then(()=>{
    console.log('promise complete', preloader.loadedAssets);

}).catch((error)=>{
    console.error('error loading assets', error);
});
