export default class ProductPriceRepository {
    constructor({ client }) {
        this.client = client;
    }
    async insert(product) {
        const priceQuery = `
        INSERT INTO product_prices (product_id, price, date, code)
        VALUES ($1, $2, now(), $3);
    `;

    const priceValues = [
        product.id,
        product.price,
        product.code
    ];

    await client.query(priceQuery, priceValues);
    }

}