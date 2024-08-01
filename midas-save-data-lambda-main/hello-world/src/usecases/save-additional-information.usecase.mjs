export default class SaveAdditionalInformationUsecase {
    constructor(gateway) {
        this.gateway = gateway
    }

    async execute(additionalInformation, supermarketId) {
        await this.gateway.saveAdditionalInformation(additionalInformation, supermarketId);
        this.gateway.logInfo(`Additional information saved.`);
    }
}