export default class ProductRepository {
    constructor({ client }) {
        this.client = client;
    }
    async get(criteria) {
        // Query com a função de Haversine para converter coordenadas geográficas (lat, lng) em distância (km);
        const productQuery = `
        SELECT s.company_name, p.name, pp.price, 6371 * 2 * ATAN2(
            SQRT(
                SIN(RADIANS(s.address_lat - $1) / 2) * SIN(RADIANS(s.address_lat - $1) / 2) +
                COS(RADIANS($1)) * COS(RADIANS(s.address_lat)) *
                SIN(RADIANS(s.address_lng - $2) / 2) * SIN(RADIANS(s.address_lng - $2) / 2)
            ),
            SQRT(1 - (
                SIN(RADIANS(s.address_lat - $1) / 2) * SIN(RADIANS(s.address_lat - $1) / 2) +
                COS(RADIANS($1)) * COS(RADIANS(s.lat)) *
                SIN(RADIANS(s.address_lng - $2) / 2) * SIN(RADIANS(s.address_lng - $2) / 2)
            ))
        ) AS distance FROM products as p 
        INNER JOIN supermarkets as s ON s.id = p.supermarket_id
        INNER JOIN product_prices as pp ON pp.product_id = p.id
        WHERE p.name LIKE '%$3%' AND distance <= $4;
    `;

    const productValues = [
        criteria.lat,
        criteria.lng,
        criteria.name,
        criteria.radius
    ];

    const result = await this.client.query(productQuery, productValues);
    return result.rows;
    }

}