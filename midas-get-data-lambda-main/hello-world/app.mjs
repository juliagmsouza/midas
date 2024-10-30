import express from 'express';
import ProductRepository from './src/infra/repositories/product.repository.mjs';
import GetProductGateway from './src/adapters/get-product.gateway.mjs';
import GetProductUsecase from './src/usecases/get-product.mjs';


const app = express()
app.use(express.json());
const port = 3000

app.post('/', async (req, res) => {
    const {coord, name } = req.body;

    // Repositories
    const productRepository = new ProductRepository({ client });

    // Services
    const logger = new Logger();
    
    // Gateways
    const getProductGateway = new GetProductGateway({ productRepository, logger })

    // Usecases
    const getProductUsecase = new GetProductUsecase({ gateway: getProductGateway })

    // Execução
    const productsList = await getProductUsecase.execute({ lat: coord[0], lng: coord[1], name });
    res.json({ list: productsList });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
