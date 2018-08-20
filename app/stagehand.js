export class StageHand {

    constructor(script){

        script = script || {};

        this.script = script;
        this.queue = [];

        this.stage = document.querySelector('#stage');

    }


    _placeActor(labels)
    {   
        let actor = document.createElement('div');
        actor.className = labels;
        
        stage.appendChild(actor);

    }
}