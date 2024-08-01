import pg from 'pg';
import SuperMarketRepository from './src/infra/repositories/supermarket.repository.mjs';
import ProductRepository from './src/infra/repositories/product.repository.mjs';
import ProductPriceRepository from './src/infra/repositories/product-price.repository.mjs';
import AdditionalInformationRepository from './src/infra/repositories/additional-information.repository.mjs';
import Logger from './src/infra/services/logger.service.mjs';
import SaveSupermarketGateway from './src/adapters/save-supermarket.gateway.mjs';
import SaveProductsAndPriceGateway from './src/adapters/save-products-and-price.gateway.mjs';
import SaveAdditionalInformationGateway from './src/adapters/save-additional-information.gateway.mjs';
import SaveAdditionalInformationUsecase from './src/usecases/save-additional-information.usecase.mjs';
import SaveProductsAndPricesUsecase from './src/usecases/save-products-and-price.usecase.mjs';
import SaveSupermarketUsecase from './src/usecases/save-supermarket.usecase.mjs';

const { Pool } = pg;
const pool = new Pool({
    connectionString: 'postgresql://root:9gnvu5tvk4gkzUJBk5k3cj89d2dm9tJb@dpg-cq5dqqlds78s73d0fn6g-a.oregon-postgres.render.com/midaspostgresql',
    ssl: {
        rejectUnauthorized: false
    }
});

export const lambdaHandler = async (event) => {
    let client;
    try {
        let messageBody;
        const record = event.Records[0];
        if (record) {
            messageBody = JSON.parse(record.body).Message;
        }
        client = await pool.connect();

        // Repositories
        const supermarketRepository = new SuperMarketRepository({ client });
        const productRepository = new ProductRepository({ client });
        const productPriceRepository = new ProductPriceRepository({ client });
        const additionalInformationRepository = new AdditionalInformationRepository({ client });

        // Services
        const logger = new Logger();

        // Gateways
        const saveSupermarketGateway = new SaveSupermarketGateway({ supermarketRepository, logger });
        const saveProductsAndPriceGateway = new SaveProductsAndPriceGateway({ productRepository, productPriceRepository, logger });
        const saveAdditionalInformationGateway = new SaveAdditionalInformationGateway({ additionalInformationRepository, logger });


        // Usecases
        const saveSupermarketUsecase = new SaveSupermarketUsecase({ gateway: saveSupermarketGateway })
        const saveProductsAndPricesUsecase = new SaveProductsAndPricesUsecase({ gateway: saveProductsAndPriceGateway })
        const saveAdditionalInformationUsecase = new SaveAdditionalInformationUsecase({ gateway: saveAdditionalInformationGateway })

        // execução
        data = JSON.parse(messageBody);
        const { companyName, cnpj, stateRegistration, address, products, additionalInformation } = data;

        const supermarketData = {
            companyName,
            cnpj,
            stateRegistration,
            address,
        };

        const supermarketId = await saveSupermarketUsecase.execute(supermarketData);
        await saveProductsAndPricesUsecase.execute(products, supermarketId);
        await saveAdditionalInformationUsecase.execute(additionalInformation, supermarketId)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Dados processados com sucesso!'
            }),
        };
    } catch (err) {
        console.error('Erro ao processar dados:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Erro ao processar dados',
                error: err.message
            }),
        };
    } finally {
        if (client) {
            client.release();
        }
    }
};