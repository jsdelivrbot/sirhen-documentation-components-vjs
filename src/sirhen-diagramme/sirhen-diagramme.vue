<!--
A voir: PlantUML
-->

<i18n>
{
  "en": {
  },
  "fr": {
  }
}
</i18n>

<template>
<div style="font-family:arial" >
<div v-if="edit" style="display:flex" width="100%">
<div style="" class="leftPadding">
<div style="box-sizing: border-box;">
<input v-model="title" style="margin-bottom:5px;width:100%">
</div>
<div>
<select v-model="diagramtype" style="width:100%">
<option disabled value="">Choisissez</option>
<option value="class">Classe</option>
<option value="usecase">Cas d'utilisation</option>
<option value="activity">Activité</option>
</select>
</div>
<div>
<textarea v-model="content" rows="10" style="width:100%; min-width:500px" class="yuml" ></textarea>
</div>
</div>
<span class="leftPadding">
<i class="fa fa-save button" style="margin-bottom:5px" @click="save" title="Save" :class="{'button-enabled' : title}" v-if="localStorageActivated"/>
<i class="fa fa-copy button" :class="{'button-enabled' : title}" style="margin-bottom:5px" @click="copy" title="Copier l'url de l'image" />
<i class="fa fa-close button button-enabled" @click="edit=false" title="Fermer"/>
</span>
<div style="padding-left:20px" v-if="hasDiagrams" >
<h4 style="margin:0 0 5px 0"><i class="fa fa-cubes" /> Diagrammes Locaux</h4>
<div v-for="diagram in diagrams" class="leftPadding">
	<i class="fa fa-cube"/>
	<span class="leftPadding button-enabled" @click="editDiagram(diagram)" >{{diagram.title}}</span>
	<i class="fa fa-trash button-enabled leftPadding" title="Supprimer" @click="remove(diagram)"/>
</div>
</div>

<div style="padding-left:20px" >
<h4 style="margin:0 0 5px 0"><i class="fa fa-cubes" /> Exemples </h4>
<div v-for="diagram in examples" class="leftPadding">
	<i class="fa fa-cube"/>
	<span class="leftPadding button-enabled" @click="editDiagram(diagram)" >{{diagram.title}}</span>
</div>
</div>

</div>
<span class="content" >
<slot></slot>
</span>
<img :src="url" v-if="content" @click="open" class="diagram"/>
</div>
</template>

<script>
export default {
  
	props: {
		debug:  {
			type: Boolean,
			default: false
		},
		diagram:  {
			type: String,
			default: 'class'
		}
	},
	
	 computed: {
		 url: function () {
			 return this.rooturl+this.diagramtype+'/'+this.content
		    },
		    
		 localStorageActivated: function() {
			 if(typeof localStorage!='undefined') {
				 return true;
			 }
			 else {
				 return false;
			 }
		 },
		 
		 hasDiagrams: function() {
			 if (this.diagrams.length >0) {
				 return true
			 }
			 else {
				 return false
			 }
		 },
		 
		 yumlimg: function() {
			 return "<img src=\""+this.url+"\" />"
		 }
	 },
  
	mounted: function() {
		this.content=this.$el.querySelector(".content").innerText.trim();
		this.edit = this.debug;
		this.diagramtype = this.diagram;
		this.refreshDiagramList();
		
	},
  
	data () {
		return {
			rooturl: "http://yuml.me/diagram/plain/",
			content: null,
			edit: false,
			title:"mon-schema",
			keyprefix:"sirhen-uml-",
			diagrams: [],
			examples: [
				{title:'gros diagramme de classes', diagramtype:'class', content:'[note: You can stick notes on diagrams too!{bg:cornsilk}],[Customer]<>1-orders 0..*>[Order], [Order]++*-*>[LineItem], [Order]-1>[DeliveryMethod], [Order]*-*>[Product], [Category]<->[Product], [DeliveryMethod]^[National], [DeliveryMethod]^[International]'},
				{title:'diagramme de composants', diagramtype:'class', content:'[whizu-jquery-mobile{bg:green}]uses-.->[whizu-core],[whizu-core{bg:orange]-.->[slf4j-api-1.7.5],[whizu-core]-.->[commons-lang-2.7],  [whizu-core]-.->[servlet-api-3.1]'},
				{title:'petit diagramme d\'acteurs', content: '[Cms Admin]^[User]', diagramtype:'usecase'},
				{title:'gros diagramme d\'acteurs', diagramtype:'usecase', content: '(note: figure 1.2{bg:beige}), [User]-(Login),[Site Maintainer]-(Add User),(Add User)<(Add Company),[Site Maintainer]-(Upload Docs),(Upload Docs)<(Manage Folders),[User]-(Upload Docs), [User]-(Full Text Search Docs), (Full Text Search Docs)>(Preview Doc),(Full Text Search Docs)>(Download Docs), [User]-(Browse Docs), (Browse Docs)>(Preview Doc), (Download Docs), [Site Maintainer]-(Post New Event To The Web Site), [User]-(View Events)'},
				{title:'diagramme activités', diagramtype:'activity', content: '(start)->[Water]->(Fill Kettle)->(end)'}
			]
		}
	},
	
	methods: {
		open: function(e) {
				  if ((e.shiftKey) || (e.ctrlKey)) {
					  this.edit=!this.edit;
				  }
		},
		
		copy: function() {
		    var tempInput = document.createElement("input");
		    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
		    tempInput.value = this.yumlimg;
		    document.body.appendChild(tempInput);
		    tempInput.select();
		    document.execCommand("copy");
		    document.body.removeChild(tempInput);
		},
		
		editDiagram: function(diagram) {
			this.title = diagram.title;
			this.content = diagram.content;
			this.diagramtype = diagram.diagramtype
		},
		
		save: function() {
			var aux = {}
			aux.content=this.content
			aux.title = this.title
			aux.diagramtype = this.diagramtype
			var json = JSON.stringify(aux);
			window.localStorage.setItem(this.keyprefix+this.title,json);
			this.refreshDiagramList()
		},
		
		remove: function(diagram) {
			window.localStorage.removeItem(this.keyprefix+diagram.title);
			this.refreshDiagramList()
		},
		
		refreshDiagramList: function() {
			if (this.localStorageActivated) {
				var diagrams = [];
				var i = 0
				for (i = 0; i < window.localStorage.length; i++) {
				    var key = window.localStorage.key(i);
				    if (key.startsWith(this.keyprefix)) {
				        var aux = JSON.parse(window.localStorage.getItem(key))
				        diagrams.push(aux)
				    }
				}
				this.diagrams = diagrams
			}
		}
	}
  
	
} // default
</script>

<style>

.diagram {
    height: 100%;
    width: auto;
}

	.content {
		display: none;
	}
	
	.leftPadding {
		margin-left:10px;
	}
	
	.button {
		display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    background: #e2e2e2;
    color: #333;
    font-size: 1rem;
	}
	
	.button-enabled {
		cursor: pointer;
	}
	
	.button-enabled:hover {
		  filter: brightness(85%);
	}
 </style>