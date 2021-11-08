import firebase from 'firebase/compat/app'
export default ({
    state: {
        info: {},
    },
    mutations: {
        USER_INFO(state, info) {
            state.info = info
        },
        //
        //*чистит стэйт
        //
        CLEAR_USER_INFO(state) {
            state.info = {}
        }
    },
    actions: {
        //
        //*берет инфу о юзере с бд записывает в стор через мутац
        //
        async USER_INFO_ACTION(ctx) {
            try {
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION');
                // eslint-disable-next-line no-unused-vars
                const info = await firebase.database().ref(`/users/${uid}/info`).once('value', info => ctx.commit('USER_INFO', info.val()));
                // console.log(info.val());
            } catch (error) {
                console.log(error);
            }

        },
        //
        //*меняет имя юзера в бд и получает из бд обновленную инфу, перезаписывает стор
        //
        async UPDATE_USER_INFO_ACTION(ctx, newName) {
            try {
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION');
                // eslint-disable-next-line no-unused-vars
                const info = await firebase.database().ref(`/users/${uid}`).child('info').update({ name: newName })
                ctx.dispatch('USER_INFO_ACTION')

            } catch (error) {
                console.log(error);
            }

        }
    },
    getters: {
        //
        //*для трансляции в компоненты
        //
        USER_INFO_GET(state) {
            return state.info
        }
    },
});