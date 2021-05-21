import Vue from 'vue'
import $ from 'jquery'
import Tether from 'tether'
import Echo from "laravel-echo"
import Meta from 'vue-meta'
import Router from 'vue-router'
import swal from 'sweetalert'

import './components'
import './util/interceptors'
import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/src/css/index.scss';
import VueTheMask from 'vue-the-mask';
import VueChatScroll from 'vue-chat-scroll';
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard);
Vue.use(VueChatScroll);
Vue.use(VueTheMask);
Vue.use(Tooltip, {
    delay: 200,
    placement: 'auto',
    triggers: ['hover', 'focus'],
    offset: 5
});
Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(Meta);

window.Vue = require('vue');
window.jQuery = $;
window.Tether = Tether;
window.swal = swal;
window._ = require('lodash');
window.Pusher = require('pusher-js');
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: Laravel.pusherKey,
    cluster: Laravel.pusherCluster,
    encrypted: Laravel.pusherEncrypted,
});

window.moment = require('moment-timezone');

require('bootstrap');

Stripe.setPublishableKey(Laravel.stripeKey);
