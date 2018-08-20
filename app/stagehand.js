export class StageHand {

    constructor(script){

        script = script || {};

        this.scriptPointer = 0;
        this.script = script;
        this.queue = [];

        this.stage = document.querySelector('#stage');

    }

    Manage(currTime){

        // Remove expired script points from the queue
        while(this._cleanQueue(currTime)){}

        // Check for new script points to add
        for( let sidx = this.scriptPointer; sidx < this.script.length; sidx++ ){
            //console.log('[StageHand]', 'checking script', scriptpoint);
            if( currTime > this.script[sidx].start ){
                //console.log('[StageHand]', 'position found');
                this._loadQueue(this.script[sidx]);
                this.scriptPointer++;
                break;
            }
        }

        // Process the Queue
        this._processQueue();
    }

    _processQueue(){
        for( let qPtr of this.queue ){
            this._placeActor(qPtr.actor);
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

    _placeActor(labels)
    {   
        let actor = document.createElement('div');
        actor.className = labels;
        
        stage.appendChild(actor);

    }
}