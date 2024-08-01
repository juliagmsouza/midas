import EventPublisher from "./src/infra/event-publisher.mjs";
import HtmlParser from "./src/infra/html-parser.mjs";
import HtmlRequester from "./src/infra/html-requester.mjs";
import HtmlParser from "./src/infra/html-parser.mjs";
import HtmlRequester from "./src/infra/html-requester.mjs";
import PublishScrapperGateway from "./src/adapters/publishScrapperData.gateway.usecase.mjs";
import PublishScrappedDataUsecase from "./src/use-cases/publish-scrapped-data.usecase.mjs";


export const lambdaHandler = async (event) => {
    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        const url = messageBody.Message;

        const eventPublisher = new EventPublisher();
        const htmlParser = new HtmlParser();
        const htmlRequester = new HtmlRequester();
        const gateway = new PublishScrapperGateway({ eventPublisher, htmlParser, htmlRequester });
        const usecase = new PublishScrappedDataUsecase(gateway);

        await usecase.execute(url);
    }
};