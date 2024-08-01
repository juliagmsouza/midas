export default class PublishScrappedDataUsecase {
    constructor(gateway) {
        this.gateway = gateway
    }

    async execute(url) {
        const websiteData = await this.gateway.getHtmlData(url);
        const nfe = this.gateway.extractNfeData(websiteData);

        await this.gateway.sendMessage(nfe);
    }
}