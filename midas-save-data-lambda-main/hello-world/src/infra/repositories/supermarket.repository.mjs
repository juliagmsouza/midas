export default class SupermarketRepository {
    constructor({ client }) {
        this.client = client;
    }
    async upsert(data) {
        const { companyName, cnpj, stateRegistration, address } = data;

        // Inserir ou atualizar supermercado
        const supermarketQuery = `
        INSERT INTO supermarkets (company_name, cnpj, state_registration, address_street, address_number, address_neighborhood, address_zip_code, address_city, address_state, address_lat, address_lng)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (cnpj) DO UPDATE
        SET company_name = EXCLUDED.company_name,
            state_registration = EXCLUDED.state_registration,
            address_street = EXCLUDED.address_street,
            address_number = EXCLUDED.address_number,
            address_neighborhood = EXCLUDED.address_neighborhood,
            address_zip_code = EXCLUDED.address_zip_code,
            address_city = EXCLUDED.address_city,
            address_state = EXCLUDED.address_state,
            address_lat = EXCLUDED.address_lat,
            address_lng = EXCLUDED.address_lng
        RETURNING id;
    `;

        const supermarketValues = [
            companyName,
            cnpj,
            stateRegistration,
            address.street,
            address.number,
            address.neighborhood,
            address.zipCode,
            address.city,
            address.state,
            address.lat,
            address.lng
        ];

        const res = await this.client.query(supermarketQuery, supermarketValues);
        const supermarketId = res.rows[0].id;
        return supermarketId;
    }

}