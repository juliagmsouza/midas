export default class GetProductUsecase {
    constructor(gateway) {
        this.gateway = gateway
    }

    async execute(input) {
        this.gateway.logInfo(`Retrieving product data in a 2km radius.`);
        const radius = 2;
        const criteria = {
            ...input,
            radius
        }
        const productInfo = await this.gateway.getProduct(criteria);
        this.gateway.logInfo(`Product data retrieved successfully.`);
        return productInfo;
    }
}