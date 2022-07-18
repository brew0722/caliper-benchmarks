'use strict';
/**
* Class for managing simple account states. 
*/


const Dictionary = 'abcdefghijklmnopqrstuvwxyz';


class SimpleState {
    /** 
    * Initializes the instance.
    */
    constructor(moneyToTransfer = 0) {
        this.moneyToTransfer = moneyToTransfer;
    }

    /**
    * Get the arguments for transfering money between accounts. 
    * @returns {object} The account arguments.
    */
    getTransferArguments() {
        return {
            target: "0x3fd66484f381b0c3fbe941f843ebf18ad9db57bb",
            amount: this.moneyToTransfer
        };
    }
}
module.exports = SimpleState;