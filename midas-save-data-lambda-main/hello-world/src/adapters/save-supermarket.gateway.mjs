export default class SaveSupermarketGateway {
    constructor({ supermarketRepository, logger }) {
        this.supermarketRepository = supermarketRepository;
        this.logger = logger;
    }

    async saveSupermarket(supermarketData){
        return this.supermarketRepository.upsert(supermarketData);
    }

    logInfo(message){
        return  this.logger.info(message);
    }
}