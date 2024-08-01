export default class SaveAdditionalInformationGateway {
    constructor({ additionalInformationRepository, logger }) {
        this.additionalInformationRepository = additionalInformationRepository;
        this.logger = logger;
    }

    async saveAdditionalInformation(additionalInformation, supermarketId){
        return this.additionalInformationRepository.insert(additionalInformation, supermarketId);
    }

    logInfo(message){
        return  this.logger.info(message);
    }
}