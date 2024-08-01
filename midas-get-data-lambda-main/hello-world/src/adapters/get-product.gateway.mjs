export default class GetProductGateway {
    constructor({ productRepository, logger }) {
        this.productRepository = productRepository;
        this.logger = logger;
    }

    async getProduct(input){
        return this.productRepository.get(input);
    }

    logInfo(message){
        return  this.logger.info(message);
    }
}