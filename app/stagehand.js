export class StageHand {

    constructor(script, plugins){

        script = script || {};
        plugins = plugins || null;

        this.scriptPointer = 0;
        this.script = script;
        this.queue = [];

        this.plugins = plugins;
        this.stage = document.querySelector('#stage');

    }

    Manage(currTime){

        // Remove expired script points from the queue
        while(this._cleanQueue(currTime)){}

        // Check for new script points to add
        for( let sidx = this.scriptPointer; sidx < this.script.length; sidx++ ){
            //console.log('[StageHand]', 'checking script', scriptpoint);
            if( currTime > this.script[sidx].start && currTime < this.script[sidx].end ){
                //console.log('[StageHand]', 'position found');
                this._loadQueue(this.script[sidx]);
                this.scriptPointer = sidx+1;
                break;
            }
        }

        // Process the Queue
        this._processQueue(Math.floor(currTime));
    }

    Reset(){
        console.log('[StageHand]', 'resetting');
        this.scriptPointer = 0;
        this.queue = [];
        this._cleanAllActors();
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

    _processQueue(currTime){

        this._cleanStage(currTime);

        for( let qPtr of this.queue ){
            let classRef = '.actor.'+qPtr.actor.replace(' ','.');
            let rndSeed = Math.floor(Math.random()*qPtr.randomize);
            // Limit number of actors to script maxct
            if( this.stage.querySelectorAll(classRef).length < qPtr.maxct ){
                console.log('[StageHand]', 'random seed', rndSeed);
                if(rndSeed === 0){
                    if( qPtr.plugin ){
                        console.log('calling plugin', qPtr.plugin);
                        this.plugins[qPtr.plugin].Process(qPtr.actor, currTime+qPtr.duration);
                    }else{
                        this._placeActor(qPtr.actor, currTime+qPtr.duration);
                    }
                }
            }
        }
    }

    _cleanQueue(currTime){
        for( let sidx = 0; sidx < this.queue.length; sidx++ ){
            //console.log('[StageHand]', 'queue ck', currTime, this.queue[sidx].end );
            if( currTime > this.queue[sidx].end ){
                this.queue.splice(sidx, 1);
                console.log('[StageHand]', 'queue cleaned', this.queue);
                return true;
            }
        }
        return false;
    }

    _loadQueue(newItem){
        this.queue.push(newItem);
        console.log('[StageHand]', 'queue added', this.queue);
    }

    _placeActor(classes, expiration)
    {   
        let actor = document.createElement('div');
        actor.className = 'actor '+classes;
        actor.dataset['expiration'] = expiration;

        let mask = document.createElement('div');
        mask.className = 'mask';
        actor.appendChild(mask);
        
        this.stage.appendChild(actor);

    }
}