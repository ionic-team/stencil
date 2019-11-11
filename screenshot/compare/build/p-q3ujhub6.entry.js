import{r as t,h as s}from"./p-b6e44a24.js";const e=class{constructor(s){t(this,s),this.appSrcUrl="",this.imagesUrl="/data/images/",this.buildsUrl="/data/builds/"}async componentWillLoad(){let t="master";this.match&&this.match.params.buildId&&(t=this.match.params.buildId.substr(0,7));let s=`${this.buildsUrl}${t}.json`;"master"===t&&(s+=`?ts=${Date.now()}`);const e=await fetch(s);e.ok&&(this.build=await e.json(),document.title=`${this.build.id} Preview: ${this.build.message}`)}render(){const t=[];return this.build&&this.build.screenshots.forEach(s=>{const e=s.testPath.split("/");e.pop();const i=`/data/tests/${this.build.id}/${e.join("/")}/`;if(!t.some(t=>t.url===i)){const e={desc:s.desc.split(",")[0],url:i};t.push(e)}}),t.sort((t,s)=>t.desc.toLowerCase()<s.desc.toLowerCase()?-1:t.desc.toLowerCase()>s.desc.toLowerCase()?1:0),[s("compare-header",{appSrcUrl:this.appSrcUrl}),s("section",{class:"scroll-y"},s("section",{class:"content"},this.build?s("h1",null,s("a",{href:this.build.url},this.build.message)):null,t.map(t=>s("div",null,s("a",{href:t.url},t.desc)))))]}static get style(){return"screenshot-preview{display:block}screenshot-preview .scroll-y{width:100%}screenshot-preview h1{color:var(--analysis-data-color);font-size:16px;margin:0}screenshot-preview .content{padding:80px 20px 140px 20px}screenshot-preview a{display:block;padding:8px;color:var(--analysis-data-color);text-decoration:none}screenshot-preview a:hover{text-decoration:underline}screenshot-preview compare-header{left:0;padding:0;width:100%;height:auto;padding-top:env(safe-area-inset-top)}screenshot-preview compare-header compare-filter{display:none}\@media (max-width:480px){screenshot-preview a{padding:12px;font-size:18px}screenshot-preview a:hover{text-decoration:none}}"}};export{e as screenshot_preview};