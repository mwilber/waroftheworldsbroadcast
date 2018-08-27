export class Leaf{

    constructor(stage){

        this.stage = stage;

    }

    _placeActor(classes, expiration)
    {   
        console.log('[Leaf]', 'placing actor');
        let actor = document.createElement('div');
        actor.className = 'actor '+classes;
        actor.dataset['expiration'] = expiration;

        let mask = document.createElement('div');
        mask.className = 'mask';
        actor.appendChild(mask);
        
        this.stage.appendChild(actor);

    }
}