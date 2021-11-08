import firebase from 'firebase/compat/app'
export default ({
    state: {
    },
    mutations: {
    },
    actions: {
        //*логин по введенному логинпаролю
        async LOGIN_ACTION(ctx, formData) {
            try {
                await firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
            } catch (error) {
                ctx.commit('SET_ERROR', error);
                throw error
            }
        },
        //*логаут + чистит стор
        async LOOUT_ACTION(ctx) {
            await firebase.auth().signOut()
            ctx.commit('CLEAR_USER_INFO')
        },
        //*регистрация в бд
        //*создает объект инфо в новой регистрации
        async REGISTRATION_ACTION(ctx, formData) {
            try {
                await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password, formData.name)
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION')

                await firebase.database().ref(`/users/${uid}/info`).set({
                    bill: 10000,
                    name: formData.name,
                })
            } catch (error) {
                ctx.commit('SET_ERROR', error);
                throw error
            }
        },
        //*получение id попользователя
        ID_FROM_BASE_ACTION() {
            const user = firebase.auth().currentUser

            return user ? user.uid : null
        }
    },
    modules: {
    }
})