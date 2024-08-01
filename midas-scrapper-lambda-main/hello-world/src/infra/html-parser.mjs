import * as cheerio from 'cheerio'; 
export default class HtmlParser {
    async extractNfeData($){
        const $ = cheerio.load(response.data);

        // Function to clean text
        const cleanText = (text) => text?.replace(/\s+/g, ' ').trim();

        // Function to extract numeric values from text
        const extractNumeric = (text) => parseFloat(text.replace(/[^0-9,.-]+/g, '').replace(',', '.'));

        // Extract company information
        const companyName = cleanText($('th.text-uppercase b').text());
        const cnpjText = cleanText($('td').filter((i, el) => $(el).text().includes('CNPJ')).text());
        const cnpj = cleanText(cnpjText.split('CNPJ:')[1].split(',')[0]);
        const stateRegistration = cleanText(cnpjText.split('Inscrição Estadual:')[1]);

        // Extract address information
        const addressText = cleanText($('td[style*="italic"]').text());
        const addressParts = addressText.split(',');
        const address = {
            street: cleanText(addressParts[0]),
            number: cleanText(addressParts[1]),
            neighborhood: cleanText(addressParts[2]),
            zipCode: cleanText(addressParts[3].split(' ')[1]),
            city: cleanText(addressParts[3].split('-')[1]),
            state: cleanText(addressParts[4].split('-')[0])
        };

        if (address.zipCode) {
            try {
                const geoByCep = await axios.get(`https://cep.awesomeapi.com.br/json/${address.zipCode}`);
                const geoByCepData = geoByCep.data;
                address.latitude = geoByCepData.lat;
                address.longitude = geoByCepData.lng;
            } catch (geoError) {
                try {
                    function removePrefixes(text) {
                        const prefixes = ["Av", "Av.", "Avenida", "Rua", "R.", "Rodovia"];
                        let cleanedText = text;
                        prefixes.forEach(prefix => {
                            const regex = new RegExp(`^${prefix}\\s+`, 'i');
                            cleanedText = cleanedText.replace(regex, '');
                        });
                        return cleanedText;
                    };

                    const street = removePrefixes(address.street);
                    const geoByFullAddress = await axios.get(`https://viacep.com.br/ws/${address.state}/${address.city}/${street}/json`);
                    const geoByFullAddressData = geoByFullAddress.data;

                    if (!geoByFullAddressData || geoByFullAddressData.length === 0) {
                        console.log('Via cep do not return any data.')
                    }

                    function findAddressByStreetAndNeighborhood(street, neighborhood) {
                        return geoByFullAddressData.find(geo =>
                            geo.logradouro.toLowerCase().includes(street.toLowerCase()) &&
                            geo.bairro.toLowerCase().includes(neighborhood.toLowerCase()));
                    }

                    const findedAddress = findAddressByStreetAndNeighborhood(address.street, address.neighborhood) || geoByFullAddressData[0];

                    const geoByCepWithFindedAddress = await axios.get(`https://cep.awesomeapi.com.br/json/${findedAddress.cep}`);
                    const geoByCepDataWithFindedAddress = geoByCepWithFindedAddress.data;

                    address.lat = geoByCepDataWithFindedAddress.lat;
                    address.lng = geoByCepDataWithFindedAddress.lng;
                    address.zipCode = findedAddress.cep;
                } catch (geoError) {
                    console.error(`Error fetching geolocation data: ${geoError}`);
                }
            }
        }

        // Extract products
        const products = [];
        $('#myTable tr').each((index, element) => {
            const tds = $(element).find('td');
            const priceText = cleanText($(tds[3]).text().split(': ')[1]);
            const price = extractNumeric(priceText);
            const unit = cleanText($(tds[2]).text().split(': ')[1]);
            const quantity = extractNumeric(cleanText($(tds[1]).text().split(': ')[1]));

            const product = {
                product: cleanText($(tds[0]).find('h7').text()),
                code: cleanText($(tds[0]).text().split('Código: ')[1]).replace(')', ''),
                quantity,
                unit,
                price
            };

            if (unit === 'KG' && quantity > 0) {
                product.pricePerKg = parseFloat((price / quantity).toFixed(2));
            }

            products.push(product);
        });

        // Extract additional information
        const totalItems = parseInt(cleanText($('.row .col-lg-2 strong').first().text()));
        const totalValue = extractNumeric(cleanText($('.row .col-lg-2 strong').eq(1).text()));
        const valuePaid = extractNumeric(cleanText($('.row .col-lg-2 strong').eq(2).text()));
        const paymentMethod = cleanText($('div.col-lg-4').last().text());
        const accessKey = cleanText($('#collapseTwo .table tbody tr td').text() || '');
        const otherInformation = cleanText($('#collapse3 .table tbody tr td').text() || '');

        const additionalInformation = {
            totalItems,
            totalValue,
            valuePaid,
            paymentMethod,
            accessKey,
            otherInformation,
            date: new Date().toISOString()
        };

        return {
            companyName,
            cnpj,
            stateRegistration,
            address,
            products,
            additionalInformation
        };
    }
}