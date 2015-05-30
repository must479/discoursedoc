define("docker-manager/app",["exports","ember","ember/resolver","ember/load-initializers","docker-manager/config/environment"],function(e,t,a,r,n){"use strict";t["default"].MODEL_FACTORY_INJECTIONS=!0;var d=t["default"].Application.extend({modulePrefix:n["default"].modulePrefix,podModulePrefix:n["default"].podModulePrefix,Resolver:a["default"]});r["default"](d,n["default"].modulePrefix),e["default"]=d}),define("docker-manager/components/progress-bar",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Component.extend({classNameBindings:[":progress",":progress-striped","active"],active:function(){return 100!==parseInt(this.get("percent"),10)}.property("percent"),barStyle:function(){var e=parseInt(this.get("percent"),10);return e>0?(e>100&&(e=100),("width: "+this.get("percent")+"%").htmlSafe()):"".htmlSafe()}.property("percent")})}),define("docker-manager/components/repo-status",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Component.extend({tagName:"tr",upgradeDisabled:function(){var e=this.get("upgradingRepo");if(!e){var t=this.get("managerRepo");return t?!t.get("upToDate")&&t!==this.get("repo"):!1}return!0}.property("upgradingRepo","repo","managerRepo","managerRepo.upToDate"),actions:{upgrade:function(){this.sendAction("upgrade",this.get("repo"))}}})}),define("docker-manager/components/x-console",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Component.extend({classNameBindings:[":logs"],render:function(e){t["default"].isEmpty(this.get("output"))||e.push(this.get("output"))},_outputChanged:function(){t["default"].run.scheduleOnce("afterRender",this,"_scrollBottom"),this.rerender()}.observes("output"),_scrollBottom:function(){this.get("followOutput")&&this.$().scrollTop(this.$()[0].scrollHeight)},_scrollOnInsert:function(){this._scrollBottom()}.on("didInsertElement")})}),define("docker-manager/components/x-tab",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Component.extend({tagName:"li",classNameBindings:["active"],active:function(){return this.get("childViews").anyBy("active")}.property("childViews.@each.active")})}),define("docker-manager/controllers/application",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller.extend({showBanner:function(){if(this.get("bannerDismissed"))return!1;var e=this.get("banner");return e&&e.length>0}.property("banner","bannerDismissed","banner.@each"),appendBannerHtml:function(e){var t=this.get("banner")||[];-1===t.indexOf(e)&&t.pushObject(e),this.set("banner",t)},actions:{dismiss:function(){this.set("bannerDismissed",!0)}}})}),define("docker-manager/controllers/index",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller.extend({managerRepo:null,upgrading:null})}),define("docker-manager/controllers/processes",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller.extend({autoRefresh:!1,init:function(){this._super();var e=this;window.setInterval(function(){e.performRefresh()},5e3)},performRefresh:function(){this.get("autoRefresh")&&this.get("model").refresh()}})}),define("docker-manager/controllers/upgrade",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller.extend({output:null,init:function(){this._super(),this.reset()},complete:t["default"].computed.equal("status","complete"),failed:t["default"].computed.equal("status","failed"),messageReceived:function(e){switch(e.type){case"log":this.set("output",this.get("output")+e.value+"\n");break;case"percent":this.set("percent",e.value);break;case"status":this.set("status",e.value),("complete"===e.value||"failed"===e.value)&&this.set("model.upgrading",!1),"complete"===e.value&&this.set("model.version",this.get("model.latest.version"))}},upgradeButtonText:function(){return this.get("model.upgrading")?"Upgrading...":"Start Upgrading"}.property("model.upgrading"),startBus:function(){var e=this;MessageBus.subscribe("/docker/upgrade",function(t){e.messageReceived(t)})},stopBus:function(){MessageBus.unsubscribe("/docker/upgrade")},reset:function(){this.setProperties({output:"",status:null,percent:0})},actions:{start:function(){this.reset();var e=this.get("model");e.get("upgrading")||e.startUpgrade()},resetUpgrade:function(){var e=this;bootbox.confirm("WARNING: You should only reset upgrades that have failed and are not running.\n\nThis will NOT cancel currently running builds and should only be used as a last resort.",function(t){if(t){var a=e.get("model");a.resetUpgrade().then(function(){e.reset()})}})}}})}),define("docker-manager/helpers/fa-icon",["exports","ember"],function(e,t){"use strict";var a=/^fa\-.+/,r=t["default"].Logger.warn,n=function(e,n){if("string"!==t["default"].typeOf(e)){var d="fa-icon: no icon specified";return r(d),new t["default"].Handlebars.SafeString(d)}var i=n.hash,c=[],s="";return c.push("fa"),e.match(a)||(e="fa-"+e),c.push(e),i.spin&&c.push("fa-spin"),i.flip&&c.push("fa-flip-"+i.flip),i.rotate&&c.push("fa-rotate-"+i.rotate),i.lg&&(r("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}"),c.push("fa-lg")),i.x&&(r("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\""+i.x+'"}}'),c.push("fa-"+i.x+"x")),i.size&&("number"===t["default"].typeOf(i.size)?c.push("fa-"+i.size+"x"):c.push("fa-"+i.size)),i.fixedWidth&&c.push("fa-fw"),i.listItem&&c.push("fa-li"),i.pull&&c.push("pull-"+i.pull),i.border&&c.push("fa-border"),i.classNames&&!t["default"].isArray(i.classNames)&&(i.classNames=[i.classNames]),t["default"].isEmpty(i.classNames)||Array.prototype.push.apply(c,i.classNames),s+="<i",s+=" class='"+c.join(" ")+"'",i.title&&(s+=" title='"+i.title+"'"),s+="></i>",new t["default"].Handlebars.SafeString(s)};e["default"]=t["default"].Handlebars.makeBoundHelper(n),e.faIcon=n}),define("docker-manager/helpers/fmt-ago",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Handlebars.makeBoundHelper(function(e){return t["default"].isEmpty(e)?new t["default"].Handlebars.SafeString("&mdash;"):moment(e).fromNow()})}),define("docker-manager/helpers/fmt-commit",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Handlebars.makeBoundHelper(function(e,a){return t["default"].isNone(a)?void 0:new t["default"].Handlebars.SafeString("(<a href='"+a+"'>"+e+"</a>)")})}),define("docker-manager/initializers/app-version",["exports","docker-manager/config/environment","ember"],function(e,t,a){"use strict";var r=a["default"].String.classify,n=!1;e["default"]={name:"App Version",initialize:function(e,d){if(!n){var i=r(d.toString());a["default"].libraries.register(i,t["default"].APP.version),n=!0}}}}),define("docker-manager/initializers/crsf-token",["exports","ic-ajax"],function(e,t){"use strict";e["default"]={name:"findCsrfToken",initialize:function(){return t["default"]("/session/csrf").then(function(e){var t=e.csrf;$.ajaxPrefilter(function(e,a,r){e.crossDomain||r.setRequestHeader("X-CSRF-Token",t)})})}}}),define("docker-manager/initializers/export-application-global",["exports","ember","docker-manager/config/environment"],function(e,t,a){"use strict";function r(e,r){var n=t["default"].String.classify(a["default"].modulePrefix);a["default"].exportApplicationGlobal&&!window[n]&&(window[n]=r)}e.initialize=r,e["default"]={name:"export-application-global",initialize:r}}),define("docker-manager/models/process-list",["exports","ic-ajax","ember"],function(e,t,a){"use strict";var r=a["default"].Object.extend({init:function(){this._super()},refresh:function(){var e=this;return t["default"]("/admin/docker/ps").then(function(t){return e.set("output",t),e})}});r.reopenClass({find:function(){var e=r.create();return e.refresh()}}),e["default"]=r}),define("docker-manager/models/repo",["exports","ic-ajax","ember"],function(e,t,a){"use strict";var r=[],n=a["default"].Object.extend({upToDate:function(){return!this.get("upgrading")&this.get("version")===this.get("latest.version")}.property("upgrading","version","latest.version"),shouldCheck:function(){if(a["default"].isNone(this.get("version")))return!1;if(this.get("checking"))return!1;var e=this.get("lastCheckedAt");if(e){var t=(new Date).getTime()-e;return t>6e4}return!0}.property()["volatile"](),repoAjax:function(e,a){return a=a||{},a.data=this.getProperties("path","version","branch"),t["default"](e,a)},findLatest:function(){var e=this;return new a["default"].RSVP.Promise(function(t){return e.get("shouldCheck")?(e.set("checking",!0),void e.repoAjax("/admin/docker/latest").then(function(r){e.setProperties({checking:!1,lastCheckedAt:(new Date).getTime(),latest:a["default"].Object.create(r.latest)}),t()})):t()})},findProgress:function(){return this.repoAjax("/admin/docker/progress").then(function(e){return e.progress})},resetUpgrade:function(){var e=this;return this.repoAjax("/admin/docker/upgrade",{type:"DELETE"}).then(function(){e.set("upgrading",!1)})},startUpgrade:function(){var e=this;return this.set("upgrading",!0),this.repoAjax("/admin/docker/upgrade",{type:"POST"})["catch"](function(){e.set("upgrading",!1)})}});n.reopenClass({findAll:function(){return new a["default"].RSVP.Promise(function(e){return r.length?e(r):void t["default"]("/admin/docker/repos").then(function(t){r=t.repos.map(function(e){return n.create(e)}),e(r)})})},findUpgrading:function(){return this.findAll().then(function(e){return e.findBy("upgrading",!0)})},find:function(e){return this.findAll().then(function(t){return t.findBy("id",e)})}}),e["default"]=n}),define("docker-manager/router",["exports","ember","docker-manager/config/environment"],function(e,t,a){"use strict";var r=t["default"].Router.extend({location:a["default"].locationType});r.map(function(){this.route("processes"),this.resource("upgrade",{path:"/upgrade/:id"})}),e["default"]=r}),define("docker-manager/routes/index",["exports","docker-manager/models/repo","ember"],function(e,t,a){"use strict";e["default"]=a["default"].Route.extend({model:function(){return t["default"].findAll()},setupController:function(e,t){var a=this,r=a.controllerFor("application");e.setProperties({model:t,upgrading:null}),window.Discourse&&window.Discourse.hasLatestPngcrush||r.appendBannerHtml("<b>WARNING:</b> You are running an old Docker image, <a href='https://meta.discourse.org/t/how-do-i-update-my-docker-image-to-latest/23325'>please upgrade</a>."),t.forEach(function(t){t.findLatest(),t.get("upgrading")&&e.set("upgrading",t),"docker_manager"===t.get("id")&&e.set("managerRepo",t),"discourse"===t.get("id")&&"origin/master"===t.get("branch")&&r.appendBannerHtml("<b>WARNING:</b> Your Discourse is tracking the 'master' branch which may be unstable, <a href='https://meta.discourse.org/t/change-tracking-branch-for-your-discourse-instance/17014'>we recommend tracking the 'tests-passed' branch</a>.")})},actions:{upgrade:function(e){this.transitionTo("upgrade",e)}}})}),define("docker-manager/routes/processes",["exports","docker-manager/models/process-list","ember"],function(e,t,a){"use strict";e["default"]=a["default"].Route.extend({model:function(){return t["default"].find()}})}),define("docker-manager/routes/upgrade",["exports","docker-manager/models/repo","ember"],function(e,t,a){"use strict";e["default"]=a["default"].Route.extend({model:function(e){return t["default"].find(e.id)},afterModel:function(e){var r=this;return t["default"].findUpgrading().then(function(t){return t&&t!==e?a["default"].RSVP.Promise.reject("wat"):e.findLatest().then(function(){return e.findProgress().then(function(e){r.set("progress",e)})})})},setupController:function(e,t){e.reset(),e.setProperties({model:t,output:this.get("progress.logs"),percent:this.get("progress.percentage")}),e.startBus()},deactivate:function(){this.controllerFor("upgrade").stopBus()}})}),define("docker-manager/templates/application",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createElement("img");return e.setAttribute(a,"src","/assets/images/docker-manager-ea64623b074c8ec2b0303bae846e21e6.png"),e.setAttribute(a,"class","logo"),e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom;r.detectNamespace(a);var n;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(n=this.build(r),this.hasRendered?this.cachedFragment=n:this.hasRendered=!0),this.cachedFragment&&(n=r.cloneNode(this.cachedFragment,!0))):n=this.build(r),n}}}(),t=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("Upgrade");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom;r.detectNamespace(a);var n;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(n=this.build(r),this.hasRendered?this.cachedFragment=n:this.hasRendered=!0),this.cachedFragment&&(n=r.cloneNode(this.cachedFragment,!0))):n=this.build(r),n}}}(),a=function(){var e=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("        ");e.appendChild(t,a);var a=e.createElement("p"),r=e.createComment("");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom,n=t.hooks,d=n.content;r.detectNamespace(a);var i;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(i=this.build(r),this.hasRendered?this.cachedFragment=i:this.hasRendered=!0),this.cachedFragment&&(i=r.cloneNode(this.cachedFragment,!0))):i=this.build(r);var c=r.createUnsafeMorphAt(r.childAt(i,[1]),0,0);return d(t,c,e,"row"),i}}}();return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("    ");e.appendChild(t,a);var a=e.createElement("div");e.setAttribute(a,"id","banner");var r=e.createTextNode("\n      ");e.appendChild(a,r);var r=e.createElement("div");e.setAttribute(r,"id","banner-content");var n=e.createTextNode("\n        ");e.appendChild(r,n);var n=e.createElement("div");e.setAttribute(n,"class","close");var d=e.createElement("i");e.setAttribute(d,"class","fa fa-times"),e.setAttribute(d,"title","Dismiss this banner."),e.appendChild(n,d),e.appendChild(r,n);var n=e.createTextNode("\n");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("      ");e.appendChild(r,n),e.appendChild(a,r);var r=e.createTextNode("\n    ");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(t,a,r){var n=a.dom,d=a.hooks,i=d.element,c=d.get,s=d.block;n.detectNamespace(r);var o;a.useFragmentCache&&n.canClone?(null===this.cachedFragment&&(o=this.build(n),this.hasRendered?this.cachedFragment=o:this.hasRendered=!0),this.cachedFragment&&(o=n.cloneNode(this.cachedFragment,!0))):o=this.build(n);var l=n.childAt(o,[1,1]),h=n.childAt(l,[1]),u=n.createMorphAt(l,3,3);return i(a,h,t,"action",["dismiss"],{}),s(a,u,t,"each",[c(a,t,"banner")],{keyword:"row"},e,null),o}}}(),r=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("Versions");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom;r.detectNamespace(a);var n;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(n=this.build(r),this.hasRendered?this.cachedFragment=n:this.hasRendered=!0),this.cachedFragment&&(n=r.cloneNode(this.cachedFragment,!0))):n=this.build(r),n}}}(),n=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("Processes");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom;r.detectNamespace(a);var n;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(n=this.build(r),this.hasRendered?this.cachedFragment=n:this.hasRendered=!0),this.cachedFragment&&(n=r.cloneNode(this.cachedFragment,!0))):n=this.build(r),n}}}();return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createElement("header");e.setAttribute(a,"class","container");var r=e.createTextNode("\n  ");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r);var r=e.createTextNode("\n  ");e.appendChild(a,r);var r=e.createElement("h1"),n=e.createComment("");e.appendChild(r,n),e.appendChild(a,r);var r=e.createTextNode("\n");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n\n");e.appendChild(t,a);var a=e.createElement("div");e.setAttribute(a,"class","container");var r=e.createTextNode("\n\n");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r);var r=e.createTextNode("\n  ");e.appendChild(a,r);var r=e.createElement("ul");e.setAttribute(r,"class","nav nav-tabs");var n=e.createTextNode("\n    ");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("\n    ");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("\n    ");e.appendChild(r,n);var n=e.createElement("li"),d=e.createElement("a");e.setAttribute(d,"href","/");var i=e.createTextNode("Return to site");e.appendChild(d,i),e.appendChild(n,d),e.appendChild(r,n);var n=e.createTextNode("\n    ");e.appendChild(r,n);var n=e.createElement("li"),d=e.createElement("a");e.setAttribute(d,"href","/admin/backups");var i=e.createTextNode("Backups");e.appendChild(d,i),e.appendChild(n,d),e.appendChild(r,n);var n=e.createTextNode("\n  ");e.appendChild(r,n),e.appendChild(a,r);var r=e.createTextNode("\n\n  ");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r);var r=e.createTextNode("\n");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(d,i,c){var s=i.dom,o=i.hooks,l=o.block,h=o.get,u=o.content;s.detectNamespace(c);var p;i.useFragmentCache&&s.canClone?(null===this.cachedFragment&&(p=this.build(s),this.hasRendered?this.cachedFragment=p:this.hasRendered=!0),this.cachedFragment&&(p=s.cloneNode(this.cachedFragment,!0))):p=this.build(s);var m=s.childAt(p,[0]),g=s.childAt(p,[2]),f=s.childAt(g,[3]),v=s.createMorphAt(m,1,1),b=s.createMorphAt(s.childAt(m,[3]),0,0),C=s.createMorphAt(g,1,1),F=s.createMorphAt(f,1,1),x=s.createMorphAt(f,3,3),N=s.createMorphAt(g,5,5);return l(i,v,d,"link-to",["index"],{},e,null),l(i,b,d,"link-to",["index"],{},t,null),l(i,C,d,"if",[h(i,d,"showBanner")],{},a,null),l(i,F,d,"x-tab",[],{route:"index"},r,null),l(i,x,d,"x-tab",[],{route:"processes"},n,null),u(i,N,d,"outlet"),p}}}())}),define("docker-manager/templates/components/progress-bar",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createElement("div");e.setAttribute(a,"class","progress-bar"),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom,n=t.hooks,d=n.get,i=n.attribute;r.detectNamespace(a);var c;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(c=this.build(r),this.hasRendered?this.cachedFragment=c:this.hasRendered=!0),this.cachedFragment&&(c=r.cloneNode(this.cachedFragment,!0))):c=this.build(r);var s=r.childAt(c,[0]),o=r.createAttrMorph(s,"style");return i(t,o,s,"style",d(t,e,"barStyle")),c}}}())}),define("docker-manager/templates/components/repo-status",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("    Checking for new version...\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom;r.detectNamespace(a);var n;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(n=this.build(r),this.hasRendered?this.cachedFragment=n:this.hasRendered=!0),this.cachedFragment&&(n=r.cloneNode(this.cachedFragment,!0))):n=this.build(r),n}}}(),t=function(){var e=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("    Up to date\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom;r.detectNamespace(a);var n;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(n=this.build(r),this.hasRendered?this.cachedFragment=n:this.hasRendered=!0),this.cachedFragment&&(n=r.cloneNode(this.cachedFragment,!0))):n=this.build(r),n}}}(),t=function(){var e=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("        ");e.appendChild(t,a);var a=e.createElement("button");e.setAttribute(a,"class","btn");var r=e.createTextNode("Currently Upgrading...");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom,n=t.hooks,d=n.element;r.detectNamespace(a);var i;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(i=this.build(r),this.hasRendered?this.cachedFragment=i:this.hasRendered=!0),this.cachedFragment&&(i=r.cloneNode(this.cachedFragment,!0))):i=this.build(r);var c=r.childAt(i,[1]);return d(t,c,e,"action",["upgrade"],{}),i}}}(),t=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("        ");e.appendChild(t,a);var a=e.createElement("button");e.setAttribute(a,"class","btn");var r=e.createTextNode("Upgrade to the Latest Version");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom,n=t.hooks,d=n.element;r.detectNamespace(a);var i;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(i=this.build(r),this.hasRendered?this.cachedFragment=i:this.hasRendered=!0),this.cachedFragment&&(i=r.cloneNode(this.cachedFragment,!0))):i=this.build(r);var c=r.childAt(i,[1]);return d(t,c,e,"action",["upgrade"],{}),d(t,c,e,"bind-attr",[],{disabled:"upgradeDisabled"}),i}}}();return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("    ");e.appendChild(t,a);var a=e.createElement("div");e.setAttribute(a,"class","new-version");var r=e.createTextNode("\n      ");e.appendChild(a,r);var r=e.createElement("h4"),n=e.createTextNode("New Version Available!");e.appendChild(r,n),e.appendChild(a,r);var r=e.createTextNode("\n      ");e.appendChild(a,r);var r=e.createElement("ul"),n=e.createTextNode("\n        ");e.appendChild(r,n);var n=e.createElement("li"),d=e.createTextNode("Remote Version: ");e.appendChild(n,d);var d=e.createComment("");e.appendChild(n,d),e.appendChild(r,n);var n=e.createTextNode("\n        ");e.appendChild(r,n);var n=e.createElement("li"),d=e.createTextNode("Last Updated: ");e.appendChild(n,d);var d=e.createComment("");e.appendChild(n,d),e.appendChild(r,n);var n=e.createTextNode("\n        ");e.appendChild(r,n);var n=e.createElement("li");e.setAttribute(n,"class","new-commits");var d=e.createComment("");e.appendChild(n,d);var d=e.createTextNode(" new commits");e.appendChild(n,d),e.appendChild(r,n);var n=e.createTextNode("\n      ");e.appendChild(r,n),e.appendChild(a,r);var r=e.createTextNode("\n");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r);var r=e.createTextNode("    ");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n  ");return e.appendChild(t,a),t},render:function(a,r,n){var d=r.dom,i=r.hooks,c=i.get,s=i.inline,o=i.content,l=i.block;d.detectNamespace(n);var h;r.useFragmentCache&&d.canClone?(null===this.cachedFragment&&(h=this.build(d),this.hasRendered?this.cachedFragment=h:this.hasRendered=!0),this.cachedFragment&&(h=d.cloneNode(this.cachedFragment,!0))):h=this.build(d);var u=d.childAt(h,[1]),p=d.childAt(u,[3]),m=d.createMorphAt(d.childAt(p,[1]),1,1),g=d.createMorphAt(d.childAt(p,[3]),1,1),f=d.createMorphAt(d.childAt(p,[5]),0,0),v=d.createMorphAt(u,5,5);return s(r,m,a,"fmt-commit",[c(r,a,"repo.latest.version"),c(r,a,"url")],{}),s(r,g,a,"fmt-ago",[c(r,a,"repo.latest.date")],{}),o(r,f,a,"repo.latest.commits_behind"),l(r,v,a,"if",[c(r,a,"upgrading")],{},e,t),h}}}();return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createComment("");return e.appendChild(t,a),t},render:function(a,r,n){var d=r.dom,i=r.hooks,c=i.get,s=i.block;d.detectNamespace(n);var o;r.useFragmentCache&&d.canClone?(null===this.cachedFragment&&(o=this.build(d),this.hasRendered?this.cachedFragment=o:this.hasRendered=!0),this.cachedFragment&&(o=d.cloneNode(this.cachedFragment,!0))):o=this.build(d);var l=d.createMorphAt(o,0,0,n);return d.insertBoundary(o,null),d.insertBoundary(o,0),s(r,l,a,"if",[c(r,a,"repo.upToDate")],{},e,t),o}}}();return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createElement("td"),r=e.createTextNode("\n  ");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r);var r=e.createTextNode("\n  ");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r);var r=e.createTextNode("\n");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");e.appendChild(t,a);var a=e.createElement("td"),r=e.createTextNode("\n");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(a,r,n){var d=r.dom,i=r.hooks,c=i.content,s=i.get,o=i.inline,l=i.block;d.detectNamespace(n);var h;r.useFragmentCache&&d.canClone?(null===this.cachedFragment&&(h=this.build(d),this.hasRendered?this.cachedFragment=h:this.hasRendered=!0),this.cachedFragment&&(h=d.cloneNode(this.cachedFragment,!0))):h=this.build(d);var u=d.childAt(h,[0]),p=d.createMorphAt(u,1,1),m=d.createMorphAt(u,3,3),g=d.createMorphAt(d.childAt(h,[2]),1,1);return c(r,p,a,"repo.name"),o(r,m,a,"fmt-commit",[s(r,a,"repo.version"),s(r,a,"repo.url")],{}),l(r,g,a,"if",[s(r,a,"repo.checking")],{},e,t),h}}}())}),define("docker-manager/templates/components/x-tab",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createComment("");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom,n=t.hooks,d=n.content;r.detectNamespace(a);var i;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(i=this.build(r),this.hasRendered?this.cachedFragment=i:this.hasRendered=!0),this.cachedFragment&&(i=r.cloneNode(this.cachedFragment,!0))):i=this.build(r);var c=r.createMorphAt(i,0,0,a);return r.insertBoundary(i,null),r.insertBoundary(i,0),d(t,c,e,"yield"),i}}}();return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(t,a,r){var n=a.dom,d=a.hooks,i=d.get,c=d.block;n.detectNamespace(r);var s;a.useFragmentCache&&n.canClone?(null===this.cachedFragment&&(s=this.build(n),this.hasRendered?this.cachedFragment=s:this.hasRendered=!0),this.cachedFragment&&(s=n.cloneNode(this.cachedFragment,!0))):s=this.build(n);var o=n.createMorphAt(s,0,0,r);return n.insertBoundary(s,0),c(a,o,t,"link-to",[i(a,t,"route")],{},e,null),s}}}())}),define("docker-manager/templates/index",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:1,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("      ");e.appendChild(t,a);var a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a,r){var n=t.dom,d=t.hooks,i=d.set,c=d.get,s=d.inline;n.detectNamespace(a);var o;t.useFragmentCache&&n.canClone?(null===this.cachedFragment&&(o=this.build(n),this.hasRendered?this.cachedFragment=o:this.hasRendered=!0),this.cachedFragment&&(o=n.cloneNode(this.cachedFragment,!0))):o=this.build(n);var l=n.createMorphAt(o,1,1,a);return i(t,e,"repo",r[0]),s(t,l,e,"repo-status",[],{repo:c(t,e,"repo"),upgradingRepo:c(t,e,"upgrading"),managerRepo:c(t,e,"managerRepo"),upgrade:"upgrade"}),o}}}();return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createElement("table");e.setAttribute(a,"class","table"),e.setAttribute(a,"id","repos");var r=e.createTextNode("\n  ");e.appendChild(a,r);var r=e.createElement("tr"),n=e.createTextNode("\n    ");e.appendChild(r,n);var n=e.createElement("th");e.setAttribute(n,"style","width: 50%");var d=e.createTextNode("Repository Name");e.appendChild(n,d),e.appendChild(r,n);var n=e.createTextNode("\n    ");e.appendChild(r,n);var n=e.createElement("th"),d=e.createTextNode("Status");e.appendChild(n,d),e.appendChild(r,n);var n=e.createTextNode("\n  ");e.appendChild(r,n),e.appendChild(a,r);var r=e.createTextNode("\n  ");e.appendChild(a,r);var r=e.createElement("tbody"),n=e.createTextNode("\n");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("  ");e.appendChild(r,n),e.appendChild(a,r);var r=e.createTextNode("\n");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(t,a,r){var n=a.dom,d=a.hooks,i=d.get,c=d.block;n.detectNamespace(r);var s;a.useFragmentCache&&n.canClone?(null===this.cachedFragment&&(s=this.build(n),this.hasRendered?this.cachedFragment=s:this.hasRendered=!0),this.cachedFragment&&(s=n.cloneNode(this.cachedFragment,!0))):s=this.build(n);var o=n.createMorphAt(n.childAt(s,[0,3]),1,1);return c(a,o,t,"each",[i(a,t,"model")],{},e,null),s}}}())}),define("docker-manager/templates/loading",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createElement("h3");e.setAttribute(a,"class","loading");var r=e.createTextNode("Loading...");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom;r.detectNamespace(a);var n;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(n=this.build(r),this.hasRendered?this.cachedFragment=n:this.hasRendered=!0),this.cachedFragment&&(n=r.cloneNode(this.cachedFragment,!0))):n=this.build(r),n}}}())}),define("docker-manager/templates/processes",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom,n=t.hooks,d=n.get,i=n.inline;r.detectNamespace(a);var c;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(c=this.build(r),this.hasRendered?this.cachedFragment=c:this.hasRendered=!0),this.cachedFragment&&(c=r.cloneNode(this.cachedFragment,!0))):c=this.build(r);var s=r.createMorphAt(c,0,0,a);return r.insertBoundary(c,0),i(t,s,e,"x-console",[],{
output:d(t,e,"model.output")}),c}}}())}),define("docker-manager/templates/upgrade",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("  ");e.appendChild(t,a);var a=e.createElement("p"),r=e.createTextNode("Upgrade completed successfully!");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n  ");e.appendChild(t,a);var a=e.createElement("p"),r=e.createTextNode("Note: The web server restarts in the background. It's a good idea to wait 30 seconds or so\n     before refreshing your browser to see the latest version of the application.");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom;r.detectNamespace(a);var n;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(n=this.build(r),this.hasRendered?this.cachedFragment=n:this.hasRendered=!0),this.cachedFragment&&(n=r.cloneNode(this.cachedFragment,!0))):n=this.build(r),n}}}(),t=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("  ");e.appendChild(t,a);var a=e.createElement("p"),r=e.createTextNode("Sorry, there was an error upgrading Discourse. Please check the logs below.");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom;r.detectNamespace(a);var n;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(n=this.build(r),this.hasRendered?this.cachedFragment=n:this.hasRendered=!0),this.cachedFragment&&(n=r.cloneNode(this.cachedFragment,!0))):n=this.build(r),n}}}(),a=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("  ");e.appendChild(t,a);var a=e.createElement("p"),r=e.createComment("");e.appendChild(a,r);var r=e.createTextNode(" is at the newest version ");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r);var r=e.createTextNode(".");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom,n=t.hooks,d=n.content,i=n.get,c=n.inline;r.detectNamespace(a);var s;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(s=this.build(r),this.hasRendered?this.cachedFragment=s:this.hasRendered=!0),this.cachedFragment&&(s=r.cloneNode(this.cachedFragment,!0))):s=this.build(r);var o=r.childAt(s,[1]),l=r.createMorphAt(o,0,0),h=r.createMorphAt(o,2,2);return d(t,l,e,"model.name"),c(t,h,e,"fmt-commit",[i(t,e,"model.version"),i(t,e,"model.url")],{}),s}}}(),r=function(){var e=function(){return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("      ");e.appendChild(t,a);var a=e.createElement("button");e.setAttribute(a,"class","btn unlock");var r=e.createTextNode("Reset Upgrade");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(e,t,a){var r=t.dom,n=t.hooks,d=n.element;r.detectNamespace(a);var i;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(i=this.build(r),this.hasRendered?this.cachedFragment=i:this.hasRendered=!0),this.cachedFragment&&(i=r.cloneNode(this.cachedFragment,!0))):i=this.build(r);var c=r.childAt(i,[1]);return d(t,c,e,"action",["resetUpgrade"],{}),i}}}();return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("  ");e.appendChild(t,a);var a=e.createElement("div");e.setAttribute(a,"style","clear: both");var r=e.createTextNode("\n    ");e.appendChild(a,r);var r=e.createElement("button");e.setAttribute(r,"class","btn");var n=e.createComment("");e.appendChild(r,n),e.appendChild(a,r);var r=e.createTextNode("\n");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r);var r=e.createTextNode("  ");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(t,a,r){var n=a.dom,d=a.hooks,i=d.element,c=d.content,s=d.get,o=d.block;n.detectNamespace(r);var l;a.useFragmentCache&&n.canClone?(null===this.cachedFragment&&(l=this.build(n),this.hasRendered?this.cachedFragment=l:this.hasRendered=!0),this.cachedFragment&&(l=n.cloneNode(this.cachedFragment,!0))):l=this.build(n);var h=n.childAt(l,[1]),u=n.childAt(h,[1]),p=n.createMorphAt(u,0,0),m=n.createMorphAt(h,3,3);return i(a,u,t,"action",["start"],{}),i(a,u,t,"bind-attr",[],{disabled:"model.upgrading"}),c(a,p,t,"upgradeButtonText"),o(a,m,t,"if",[s(a,t,"model.upgrading")],{},e,null),l}}}();return{isHTMLBars:!0,revision:"Ember@1.11.0",blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),a=e.createElement("h3"),r=e.createTextNode("Upgrade ");e.appendChild(a,r);var r=e.createComment("");e.appendChild(a,r),e.appendChild(t,a);var a=e.createTextNode("\n\n");e.appendChild(t,a);var a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n\n");e.appendChild(t,a);var a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n");e.appendChild(t,a);var a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n");e.appendChild(t,a);var a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n");e.appendChild(t,a);var a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},render:function(n,d,i){var c=d.dom,s=d.hooks,o=s.content,l=s.get,h=s.inline,u=s.block;c.detectNamespace(i);var p;d.useFragmentCache&&c.canClone?(null===this.cachedFragment&&(p=this.build(c),this.hasRendered?this.cachedFragment=p:this.hasRendered=!0),this.cachedFragment&&(p=c.cloneNode(this.cachedFragment,!0))):p=this.build(c);var m=c.createMorphAt(c.childAt(p,[0]),1,1),g=c.createMorphAt(p,2,2,i),f=c.createMorphAt(p,4,4,i),v=c.createMorphAt(p,6,6,i),b=c.createMorphAt(p,8,8,i),C=c.createMorphAt(p,10,10,i);return o(d,m,n,"model.name"),h(d,g,n,"progress-bar",[],{percent:l(d,n,"percent")}),u(d,f,n,"if",[l(d,n,"complete")],{},e,null),u(d,v,n,"if",[l(d,n,"failed")],{},t,null),u(d,b,n,"if",[l(d,n,"model.upToDate")],{},a,r),h(d,C,n,"x-console",[],{output:l(d,n,"output"),followOutput:!0}),p}}}())}),define("docker-manager/config/environment",["ember"],function(e){var t="docker-manager";try{var a=t+"/config/environment",r=e["default"].$('meta[name="'+a+'"]').attr("content"),n=JSON.parse(unescape(r));return{"default":n}}catch(d){throw new Error('Could not read config from meta tag with name "'+a+'".')}}),runningTests?require("docker-manager/tests/test-helper"):require("docker-manager/app")["default"].create({name:"docker-manager",version:"0.0.0.a2cd2da5"});