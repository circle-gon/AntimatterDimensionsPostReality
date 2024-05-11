import { AutobuyerState } from "./autobuyer";

/**
 * @abstract
 */
class RaPetAutobuyerState extends AutobuyerState{
    /**
     * @abstract
     */
    get _petName(){ throw new NotImplementedError(); }

    get data() {
        return player.auto.pets[this._petName].upgrades[this.id-1];
    }

    get _upgradeName(){
        return ['levelUp', 'purchaseChunkUpgrade', 'purchaseMemoryUpgrade'][this.id-1];
    }

    get name(){
        return ["Level Up", "Fragmentation", "Recollection"][this.id-1];
    }

    get bulk(){
        return 0;
    }

    static get entryCount(){
        return 3;
    }

    get isUnlocked() {
        return AtomMilestone.am3.isReached;
    }

    tick(){
        const petName = this._petName;
        const upgradeName = this._upgradeName;
        Ra.pets[petName][upgradeName]();
    }
}


export class TeresaMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'teresa'; }

    static get autobuyerGroupName(){ return "Teresa's Memory"; }
    static get isActive() { return player.auto.pets.teresa.isActive; }
    static set isActive(value) { player.auto.pets.teresa.isActive = value; }
}

export class EffarigMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'effarig'; }

    static get autobuyerGroupName(){ return "Effarig's Memory"; }
    static get isActive() { return player.auto.pets.effarig.isActive; }
    static set isActive(value) { player.auto.pets.effarig.isActive = value; }
}

export class EnslavedMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'enslaved'; }

    static get autobuyerGroupName(){ return "Nameless's Memory"; }
    static get isActive() { return player.auto.pets.enslaved.isActive; }
    static set isActive(value) { player.auto.pets.enslaved.isActive = value; }
}

export class VMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'v'; }

    static get autobuyerGroupName(){ return "V's Memory"; }
    static get isActive() { return player.auto.pets.v.isActive; }
    static set isActive(value) { player.auto.pets.v.isActive = value; }
}