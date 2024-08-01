export default class SaveProductsAndPricesUsecase {
    constructor(gateway) {
        this.gateway = gateway
    }

    async execute(products, supermarketId) {
        for (const product of products){
            const productId = await this.gateway.saveProductAndPrice(product, supermarketId);
            this.gateway.logInfo(`product ${productId} saved.`);
        }
    }
}