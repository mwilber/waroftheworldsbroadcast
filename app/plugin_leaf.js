export class Leaf{

    constructor(stage){

        this.stage = stage;
        this.vines = [];

    }

    Process(script, time){
        // Add a new vine
        let xpos = Math.floor(Math.random()*(window.innerWidth*.6)-125);
        this.vines.push({
            x: xpos,
            y: 0,
            s: (250 * (1-(xpos/window.innerWidth))),
            d: script.duration
        });
    }

    Update(time){

        this._turnGrey(time);
        this._cleanStage(time);

        // Grow the vines
        for( let idx in this.vines ){
            if( this.vines.hasOwnProperty(idx) && this.vines[idx].y < window.innerHeight ){
                console.log('[Leaf]', 'vine', this.vines[idx]);
                var setsize = this.vines[idx].s;
                var randomScale = Math.random();
                if(randomScale > 0.8){
                    setsize = Math.floor(setsize*randomScale);
                }

                this._placeActor(this.vines[idx].x, this.vines[idx].y, setsize, this.vines[idx].d, time+this.vines[idx].d);

                this.vines[idx].x += Math.floor(Math.random()*100)-50;
                this.vines[idx].y += Math.floor(this.vines[idx].s/4 + (Math.random()*this.vines[idx].s/2));
            }
        }
    }

    Reset(){
        console.log('[Plugin Leaves]', 'resetting');
        this.vines = [];
        this._cleanAllActors();

    }

    _turnGrey(currTime){
        for( let actor of this.stage.querySelectorAll('.actor') ){
            if( currTime > actor.dataset.expiration-(actor.dataset.duration*0.2) ){
                actor.classList.add('dead');
                //this.stage.removeChild(actor);
            }
        }
    }

    _cleanAllActors(){
        for( let actor of this.stage.querySelectorAll('.actor') ){
            this.stage.removeChild(actor);
        }
    }

    _cleanStage(currTime){
        for( let actor of this.stage.querySelectorAll('.actor') ){
            if( currTime > actor.dataset.expiration ){
                this.stage.removeChild(actor);
            }
        }
    }

    _placeActor(x, y, s, duration, expiration)
    {   
        console.log('[Leaf]', 'placing actor', x, y);

        var rot = Math.floor(Math.random()*360);

        let actor = document.createElement('div');
        actor.className = 'actor leaf';
        actor.dataset['expiration'] = expiration;
        actor.dataset['duration'] = duration;

        let customstyle = "height: "+s+"px; width: "+s+"px; right: "+x+"px; bottom: "+y+"px;";
        actor.style.cssText = customstyle;

        let mask = document.createElement('div');
        mask.className = 'mask';
        mask.style.cssText = "transform: rotate("+rot+"deg);";
        actor.appendChild(mask);
        
        this.stage.appendChild(actor);

    }
}