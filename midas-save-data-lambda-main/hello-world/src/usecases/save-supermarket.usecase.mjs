export default class SaveSupermarketUsecase {
    constructor(gateway) {
        this.gateway = gateway
    }

    async execute(supermarketData) {
        const supermarketId = await this.gateway.saveSupermarket(supermarketData);
        this.gateway.logInfo(`Supermarket ${supermarketId} saved.`);
        return supermarketId;
    }
}