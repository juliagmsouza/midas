export default class AdditionalInformationRepository {
    constructor({ client }) {
        this.client = client;
    }
    async insert(additionalInformation, supermarketId) {
        const additionalInfoQuery = `
        INSERT INTO additional_information (supermarket_id, total_items, total_value, value_paid, payment_method, access_key, other_information, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;

    const additionalInfoValues = [
        supermarketId,
        additionalInformation.totalItems,
        additionalInformation.totalValue,
        additionalInformation.valuePaid,
        additionalInformation.paymentMethod,
        additionalInformation.accessKey,
        additionalInformation.otherInformation,
        additionalInformation.date
    ];

    await client.query(additionalInfoQuery, additionalInfoValues);
    }

}