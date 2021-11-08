import firebase from 'firebase/compat/app'
export default ({
    state: {
        categories: [],
    },
    mutations: {
        CATEGORIES(state, resp) {
            if (Array.isArray(resp)) {
                state.categories = resp
            } else {
                state.categories.push(resp)
            }
        }
    },
    actions: {
        //*получает список категорий с бд 
        //* и дописывает в каждую новый ключ e.id равный ключу этой категории в бд через цикл
        //*результат кидает в стор через мутацию
        async CATEGORIES_ACTION(ctx) {
            try {
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION');
                const ctgrs = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val() || {}

                let cat_s = []

                // Object.values(ctgrs).map((element, index) => {
                //     element['id'] = Object.keys(ctgrs)[index]
                //     cat_s.push(element)
                //     return cat_s
                // });

                // cat_s = Object.keys(ctgrs).map(key => ({ ...ctgrs[key], id: key }))
                // console.log(cat_s);

                Object.entries(ctgrs).forEach(e => { //мы не ищем легких путей-_-"""
                    e.unshift("id")
                    cat_s.push(Object.fromEntries([e.slice(0, 2)].concat(Object.entries(e[2]))));
                });
                ctx.commit('CATEGORIES', cat_s)
                return cat_s
            } catch (error) {
                ctx.commit('SET_ERROR', error)
                throw error
            }
        },
        //*пушит новую категорию в бд
        //*заново получает обновленный список категорий из бд
        async CREATE_CATEGORY_ACTION(ctx, category) {
            try {
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION');
                // eslint-disable-next-line no-unused-vars
                const ctgr = await firebase.database().ref(`/users/${uid}/categories`).push(category)
                // ctx.commit('CATEGORIES', { name: category.name, limit: category.limit, id: ctgr.key })
                ctx.dispatch('CATEGORIES_ACTION')
                // return { name: category.name, limit: category.limit, id: ctgr.key }
            } catch (error) {
                ctx.commit('SET_ERROR', error)
                throw error
            }
        },
        //*находит категорию по вписанному ранее e.id
        //*изменяет у найденной категории введенные имя и лимит
        //*заново получает обновленный список категорий из бд
        async EDIT_CATEGORIES_ACTION(ctx, category) {
            try {
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION');
                await firebase.database().ref(`/users/${uid}/categories`)
                    .child(category.id).update({ name: category.name, limit: category.limit })
                ctx.dispatch('CATEGORIES_ACTION')
            } catch (error) {
                ctx.commit('SET_ERROR', error)
                throw error
            }
        },
        //*находит категорию по вписанному ранее e.id
        //*удаляет найденную категорию из бд
        //*заново получает обновленный список категорий из бд
        async DELETE_CATEGORY_ACTION(ctx, category) {
            try {
                const uid = await ctx.dispatch('ID_FROM_BASE_ACTION');
                await firebase.database().ref(`/users/${uid}/categories`)
                    .child(category.id).remove()
                ctx.dispatch('CATEGORIES_ACTION')
            } catch (error) {
                ctx.commit('SET_ERROR', error)
                throw error
            }
        }
    },
    getters: {
        CATEGORIES_GETT(state) {
            return state.categories
        }
    },
});