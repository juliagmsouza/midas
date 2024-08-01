export default class PublishScrapperGateway {
    constructor({ httpRequester, htmlParser, eventPublisher}) {
        this.httpRequester = httpRequester;
        this.htmlParser = htmlParser;
        this.eventPublisher = eventPublisher;
    }

    async getHtmlData(url){
        return this.httpRequester.getHtmlData(url);
    }

    async extractNfeData(websiteData){
        return this.htmlParser.extractData(websiteData);
    }

    async sendMessage(message){
        return this.eventPublisher.sendMessage(message);
    }
}