'use strict';
const OperationBase = require('./utils/operation-base');
const SimpleState = require('./utils/simple-state');
/** 
* Workload module for mint token. 
*/
class Mint extends OperationBase {
    /** 
    * Initializes the instance.
    */
    constructor() {
        super();
    }
    /** 
    * Create a pre-configured state representation. 
    * @return {SimpleState} The state instance.
    */
    createSimpleState() {
        return new SimpleState(this.moneyToTransfer);
    }
    /** 
    * Assemble TXs for transferring money.
    */
    async submitTransaction() {
        await this.sutAdapter.sendRequests(this.createConnectorRequest('mint', {
            target: this.mintOwner,
            amount: this.mintAmount,
        }));
    }
}
/** 
* Create a new instance of the workload module.  
* @return {WorkloadModuleInterface} 
*/
function createWorkloadModule() {
    return new Mint();
}
module.exports.createWorkloadModule = createWorkloadModule; 