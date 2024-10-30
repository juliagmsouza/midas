export default class GetProductUsecase {
    constructor(gateway) {
        this.gateway = gateway
    }

    async execute(input) {
        this.gateway.logInfo(`Retrieving product data in a 7km radius.`);
        const radius = 7;
        const criteria = {
            ...input,
            radius
        }
        const productInfo = await this.gateway.getProduct(criteria);
        this.gateway.logInfo(`Product data retrieved successfully.`);
        return productInfo;
    }
}
