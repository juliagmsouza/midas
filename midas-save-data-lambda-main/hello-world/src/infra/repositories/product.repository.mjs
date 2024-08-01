export default class ProductRepository {
    constructor({ client }) {
        this.client = client;
    }
    async upsert(product, supermarketId) {
        const productQuery = `
        INSERT INTO products (code, name, unit, supermarket_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (code, supermarket_id) DO UPDATE
        SET name = EXCLUDED.name,
            unit = EXCLUDED.unit,
            last_updated = now()
        RETURNING id;
    `;

    const productValues = [
        product.code,
        product.product,
        product.unit,
        supermarketId
    ];

    const productRes = await this.client.query(productQuery, productValues);
    const productId = productRes.rows[0].id;
    return productId;
    }

}