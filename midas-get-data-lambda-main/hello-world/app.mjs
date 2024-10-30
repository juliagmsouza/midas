import ProductRepository from './src/infra/repositories/product.repository.mjs';
import GetProductGateway from './src/adapters/get-product.gateway.mjs';
import GetProductUsecase from './src/usecases/get-product.mjs';

const { Pool } = pg;
const pool = new Pool({
    connectionString: 'postgresql://root:9gnvu5tvk4gkzUJBk5k3cj89d2dm9tJb@dpg-cq5dqqlds78s73d0fn6g-a.oregon-postgres.render.com/midaspostgresql',
    ssl: {
        rejectUnauthorized: false
    }
});

export const lambdaHandler = async (event) => {
    let client;
    let messageBody;
        const record = event.Records[0];
        if (record) {
            messageBody = JSON.parse(record.body).Message;
        }
        client = await pool.connect();
 
    // Repositories
    const productRepository = new ProductRepository({ client });

    // Services
    const logger = new Logger();
    
    // Gateways
    const getProductGateway = new GetProductGateway({ productRepository, logger });

    // Usecases
    const getProductUsecase = new GetProductUsecase({ gateway: getProductGateway });

    // Execução
    const data = JSON.parse(messageBody);
    const productsList = await getProductUsecase.execute({ lat: data.coord[0], lng: data.coord[1], data.name });
    res.json({ list: productsList });

    
};
