import axios from 'axios';
export default class HtmlRequester {
    async getHtmlData(url){
        return axios.get(url);
    }
}