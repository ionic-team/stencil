import{r as t,h as s}from"./p-b6e44a24.js";import{g as i}from"./p-113f7459.js";function e(t,s){const i=Object.assign({},t,s),e=Object.keys(i),o=[];return e.map(t=>{const s=i[t];!0===s?o.push(t):null!=s&&""!==s&&o.push(t+"-"+s)}),window.location.hash=o.sort().join(";"),i}const o=class{constructor(s){t(this,s),this.appSrcUrl="",this.imagesUrl="/data/images/",this.buildsUrl="/data/builds/",this.comparesUrl="/data/compares/",this.jsonpUrl=null,this.diffs=[]}async componentWillLoad(){this.match&&this.match.params.buildIdA&&this.match.params.buildIdB&&await this.loadBuilds(this.match.params.buildIdA,this.match.params.buildIdB),this.diffs=await function(t,s,e){const o=[];return s&&e?(e.screenshots.forEach(s=>{o.push({id:s.id,desc:s.desc,testPath:s.testPath,imageA:null,imageUrlA:null,imageB:s.image,imageUrlB:`${t}${s.image}`,identical:!1,comparable:!1,mismatchedPixels:null,width:s.width,height:s.height,deviceScaleFactor:s.deviceScaleFactor,device:s.device||s.userAgent,show:!1,hasIntersected:!1,threshold:"number"==typeof s.threshold?s.threshold:.05})}),s.screenshots.forEach(s=>{const i=o.find(t=>t.id===s.id);i&&(i.imageA=s.image,i.imageUrlA=`${t}${s.image}`)}),o.forEach(t=>{if(t.comparable=null!=t.imageA&&null!=t.imageB,t.identical=t.comparable&&t.imageA===t.imageB,t.identical)t.mismatchedPixels=0;else{const s=i(t.imageA,t.imageB,t.threshold);"number"==typeof s&&(t.mismatchedPixels=s,0===t.mismatchedPixels&&(t.identical=!0))}}),o):o}(this.imagesUrl,this.a,this.b),this.filter=function(){const t={},s=location.hash.replace("#","");return""!==s&&s.split(";").forEach(s=>{const i=s.split("-");t[i[0]]=!(i.length>1)||i[1]}),t}(),this.updateDiffs()}componentDidLoad(){if("IntersectionObserver"in window){const t={root:document.querySelector(".scroll-y"),rootMargin:"1200px"},s=new IntersectionObserver(t=>{let s=!1;t.forEach(t=>{if(t.isIntersecting){const i=this.diffs.find(s=>t.target.id===`d-${s.id}`);i&&(i.hasIntersected=!0,s=!0)}}),s&&(window.requestIdleCallback?window.requestIdleCallback(()=>{this.updateDiffs()}):window.requestAnimationFrame(()=>{this.updateDiffs()}))},t),i=document.querySelectorAll("compare-row");for(let t=0;t<i.length;t++)s.observe(i[t])}else this.diffs.forEach(t=>{t.hasIntersected=!0}),this.updateDiffs();this.filter&&this.filter.diff&&this.navToDiff(this.filter.diff)}async loadBuilds(t,s){let i=`${this.buildsUrl}${t}.json`;"master"===t&&(i+=`?ts=${Date.now()}`);let e=`${this.buildsUrl}${s}.json`;"master"===s&&(e+=`?ts=${Date.now()}`);const o=await Promise.all([fetch(i),fetch(e)]),n=await o[0],a=await o[1];n.ok&&a.ok&&(this.a=await n.json(),this.b=await a.json())}filterChange(t){this.filter=e(this.filter,t.detail),this.updateDiffs()}diffNavChange(t){const s=t.detail;this.filter=e(this.filter,{diff:s}),this.updateDiffs(),this.navToDiff(s)}navToDiff(t){const s=document.getElementById(`d-${t}`),i=document.querySelector(".scroll-y");s&&i&&(i.scrollTop=s.offsetTop-84)}compareLoaded(t){const s=t.detail,i=this.diffs.find(t=>t.id===s.id);i&&(i.mismatchedPixels=s.mismatchedPixels),this.updateDiffs()}updateDiffs(){var t;this.diffs=(t=this.filter,this.diffs.map(s=>(s=Object.assign({},s),function(t,s){const i=!t.device||t.device===s.device,e=!t.search||s.desc.includes(t.search);let o=!0;return t.diff&&t.diff===s.id?o=!0:t.mismatch?null!=s.mismatchedPixels&&"all"!==t.mismatch&&(o=parseInt(t.mismatch,10)<s.mismatchedPixels):o=s.mismatchedPixels>0||null==s.mismatchedPixels,s.show=i&&e&&o,s}(t,s))).sort((t,s)=>t.mismatchedPixels>s.mismatchedPixels?-1:t.mismatchedPixels<s.mismatchedPixels?1:t.desc.toLowerCase()<s.desc.toLowerCase()?-1:t.desc.toLowerCase()>s.desc.toLowerCase()?1:t.device.toLowerCase()<s.device.toLowerCase()?-1:t.device.toLowerCase()>s.device.toLowerCase()?1:0))}render(){return[s("compare-header",{diffs:this.diffs,filter:this.filter,appSrcUrl:this.appSrcUrl}),s("section",{class:"scroll-x"},s("compare-thead",{a:this.a,b:this.b,diffs:this.diffs}),s("section",{class:"scroll-y"},s("compare-table",null,s("compare-tbody",null,this.diffs.map(t=>s("compare-row",{key:t.id,aId:this.a.id,bId:this.b.id,id:"d-"+t.id,show:t.show,hidden:!t.show,imagesUrl:this.imagesUrl,jsonpUrl:this.jsonpUrl,diff:t}))))))]}};export{o as screenshot_compare};