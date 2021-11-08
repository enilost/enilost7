// eslint-disable-next-line no-unused-vars
import firebase from 'firebase/compat/app'
export default ({
    state: {
        records: [],
        record: null,
    },
    mutations: {
        RECORDS(state, rec) {
            state.records = rec
        },
        DETAIL_RECORD(state, rec) {
            state.record = rec
        }
    },
    actions: {
        //*добавляет в ветку рекордс бд созданную запись
        //*обновляет данные о счете в бд инфо о юзере 
        //*получает обновленные данные с бд
        async RECORD_INCOME_ACTION(ctx, category) {
            try {
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION');
                await firebase.database().ref(`/users/${uid}/records`).push(category)
                await firebase.database().ref(`/users/${uid}/info`).update({ bill: category.bill })
                ctx.dispatch('USER_INFO_ACTION')
            } catch (error) {
                console.log(error);
            }

        },
        //
        //*получает с бд все записи рекордс
        //*проходит циклом по массиву значений полученного объекта
        //*добавляет в каждый объект массива новый ключ e.key = id этой записи в бд путем подставления индекса
        //*записывает все что получилось в стор через мут-ю
        async ALL_RECORDS_ACTION(ctx) {
            try {
                // eslint-disable-next-line no-unused-vars
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION');

                const rcrds = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val()
                for (let i = 0; i < Object.values(rcrds).length; i++) {
                    const e = Object.values(rcrds)[i];
                    e.key = Object.keys(rcrds)[i]
                }

                ctx.commit('RECORDS', Object.values(rcrds).reverse())
            } catch (error) {
                console.log(error);
            }

            //*получает отдельную нужную запись по ключу, и кидает ее в стор через мут-ю
        }, async DETAIL_RECORD_ACTION(ctx, key) {
            try {
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION');

                const rcrd = (await firebase.database().ref(`/users/${uid}/records`).child(key).once('value')).val()

                rcrd.key = key

                ctx.commit('DETAIL_RECORD', rcrd)
            } catch (error) {
                console.log(error);
            }

        }
    },
    getters: {
        RECORDS_GETT(state) {
            return state.records
        }
        ,
        DETAIL_RECORD_GETT(state) {
            return state.record
        }
    },
});