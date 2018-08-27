export class Leaf{

    constructor(stage){

        this.stage = stage;
        this.vines = [];

    }

    Process(classes, expiration){
        //if(Math.random > 0.5){
            this.vines.push({
                x: Math.floor(Math.random()*(window.innerWidth*.6)),
                y: 0
            });
        //}

        for( let idx in this.vines ){
            if( this.vines[idx].y < window.innerHeight ){
                console.log('[Leaf]', 'vine', this.vines[idx]);
                this._placeActor(this.vines[idx].x, this.vines[idx].y, expiration);
                this.vines[idx].y += 100;
            }
            
        }
    }

    _placeActor(x, y, expiration)
    {   
        console.log('[Leaf]', 'placing actor', x, y);
        let actor = document.createElement('div');
        actor.className = 'actor leaf';
        actor.dataset['expiration'] = expiration;

        let customstyle = "right: "+x+"px; bottom: "+y+"px;"
        actor.style.cssText = customstyle;

        let mask = document.createElement('div');
        mask.className = 'mask';
        actor.appendChild(mask);
        
        this.stage.appendChild(actor);

    }
}