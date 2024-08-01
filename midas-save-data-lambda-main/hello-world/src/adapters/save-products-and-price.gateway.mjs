export default class SaveProductsAndPriceGateway {
    constructor({ productRepository, logger, productPriceRepository }) {
        this.productRepository = productRepository;
        this.productPriceRepository = productPriceRepository;
        this.logger = logger;
    }

    async saveProductAndPrice(product, supermarketId){
        const productId = await this.productRepository.upsert(product, supermarketId);
        if(productId){
            await this.productPriceRepository.insert({id: productId, price: product.price, code: product.code}, supermarketId)
        }
    }

    logInfo(message){
        return  this.logger.info(message);
    }
}