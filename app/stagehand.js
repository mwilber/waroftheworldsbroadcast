export class StageHand {

    constructor(script){

        script = script || {};

        this.scriptPointer = 0;
        this.script = script;
        this.queue = [];

        this.stage = document.querySelector('#stage');

    }

    Manage(currTime){
        for( let sidx = this.scriptPointer; sidx < this.script.length; sidx++ ){
            //console.log('[StageHand]', 'checking script', scriptpoint);
            if( currTime > this.script[sidx].start ){
                //console.log('[StageHand]', 'position found');
                this._loadQueue(this.script[sidx]);
                this.scriptPointer++;
                break;
            }
        }
    }


    _loadQueue(newItem){
        this.queue.push(newItem);
        console.log('[StageHand]', 'queue added', this.queue);
    }

    _placeActor(labels)
    {   
        let actor = document.createElement('div');
        actor.className = labels;
        
        stage.appendChild(actor);

    }
}