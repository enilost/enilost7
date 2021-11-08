// eslint-disable-next-line no-unused-vars
import axios from 'axios'


export default ({
    state: {
        ExchangeRates: {},
    },
    mutations: {
        RATE(state, Response) {
            state.ExchangeRates = Response;
        },
        RATE_CLEAR(state) {
            state.ExchangeRates = {};
        },
    },
    actions: {
        //*погуглил апи центробанка России
        //*запрос json по ссылке
        //*ответ всех валют записал в стор
        RATE_ACTION(ctx) {
            return axios
                .get('https://www.cbr-xml-daily.ru/daily_json.js')
                .then((Response) => {
                    ctx.commit('RATE', Response.data)
                })
        }
    },
    getters: {
        //*трансляция всех валют для конвертации
        RATE_GET(state) {
            return state.ExchangeRates
        }
    }
});