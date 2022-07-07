/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const helper = require('../helper');
const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class DeletePreloadedAssetsWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
        this.chaincodeID = '';
        this.assetsPerWorker = [];
        this.asset = {};
        this.byteSize = 0;
    }

    /**
     * Initialize the workload module with the given parameters.
     * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
     * @param {number} totalWorkers The total number of workers participating in the round.
     * @param {number} roundIndex The 0-based index of the currently executing round.
     * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
     * @param {BlockchainInterface} sutAdapter The adapter of the underlying SUT.
     * @param {Object} sutContext The custom context object provided by the SUT adapter.
     * @async
     */
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        const args = this.roundArguments;
        this.keys = args.assets ? parseInt(args.assets) : 0;
        this.chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
        this.byteSize = args.byteSize ? args.byteSize : 100;
        this.batchSize = args.batchSize ? parseInt(args.batchSize) : 1;
        this.assetsPerWorker = helper.getAssetsPerWorker(args.assets, this.workerIndex, totalWorkers);
        this.batchesNum = Math.ceil(this.assetsPerWorker/this.batchSize);
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
     async submitTransaction() {
        for (let i = 0; i < this.batchesNum; i++) {
            const keys = []
            for (let i = 0; (i < this.batchSize) && (this.txIndex < this.assetsPerWorker); i++) {
                const key = 'client' + this.workerIndex + '_' + this.byteSize + '_' + this.txIndex;
                keys.push(key);
                this.txIndex++;
            }

            const args = {
                contractId: this.chaincodeID,
                contractFunction: 'deleteAssetsFromBatch',
                contractArguments: [JSON.stringify(keys)],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(args);
        }
    }
}
/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new DeletePreloadedAssetsWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
