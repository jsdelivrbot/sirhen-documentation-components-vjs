require("exports-loader?!./l.min.js")

import Vue from 'vue'

import vueCustomElement from 'vue-custom-element'
Vue.use(vueCustomElement);

import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import SirhenDiagramme from './sirhen-diagramme/sirhen-diagramme.vue';

ljs.addAliases({
	dep: ['https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js']
})

ljs.load('dep', function() {
	
	if (!window.registredSirhenElements) {
		window.registredSirhenElements = [];
	}
	
	function registerElement(name, component) {
        if (!window.registredSirhenElements) {
            window.registredSirhenElements = [];
        }
        if (window.registredSirhenElements.indexOf(name) < 0) {
            Vue.customElement(name, component);
            window.registredSirhenElements.push(name)
        }
    }
	
	function registerElements() {
			console.info("Start registration of Sirhen documentation components")
			console.info("Registred elements at this time: "+window.registredSirhenElements)
			registerElement('sirhen-diagramme', SirhenDiagramme);
			console.info("Sirhen documentation components registration complete")
	}
	

	registerElements()
})

