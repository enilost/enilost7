import M from "materialize-css/dist/js/materialize.min.js";

export default {
    bind(el, bind) {
        M.Tooltip.init(el, {
            position: 'top',
            html: `${bind.value}`
        });
    },

    unbind(el) {
        var instance = M.Tooltip.getInstance(el);
        if (instance) {
            instance.destroy()
        }
    }
}