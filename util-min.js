window._ds=window._ds||{},window._ds.events=[],window._ds.util=window._ds||{},(window._ds.util=this).gaEvent=function(e,t,n,i,o,a){if(e&&t){"object"!=typeof n||i||o||a?"object"!=typeof i||o||a?"object"!=typeof o||a?"object"==typeof a&&(data=a):(data=o,o=void 0):(data=i,i=void 0):(data=n,n=void 0),void 0===o&&(o=!0);var r={event:"ga-event-generic","ga-event-category":e,"ga-event-action":t,"ga-event-label":n,"ga-event-value":i,"ga-event-nonInteraction":o};for(var s in data)/^c(d|m)[1-9]($|[0-9]$)/.test(s)&&(r[s]=data[s]);dataLayer.push(r)}},this.ga_event=this.gaEvent,this.setCookie=function(e,t,n,i,o){var a=new Date;a.setTime(a.getTime()+24*n*60*60*1e3);var r=e+"="+t+";"+("expires="+a.toUTCString())+";path="+(i=i||"/");o&&(r=r+";domain="+o),document.cookie=r},this.deleteCookie=function(e,t){t=t||"/",this.setCookie(e,"",-1,t)},this.getCookie=function(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),i=0;i<n.length;i++){for(var o=n[i];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))return o.substring(t.length,o.length)}},this.injPixel=function(e){var t=document.createElement("img");t.height="1",t.width="1",t.styl="display:none",t.alt="",t.src=e,document.body.appendChild(t)},this.injIframe=function(e){var t=document.createElement("iframe");t.style.display="none",t.width="1",t.height="1",t.src=e,document.body.appendChild(e)},this.injScript=function(e,t){var n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=e,n.onload=function(){"function"==typeof t&&t()},document.body.appendChild(n)},this.listen=function(e,t,n){n=n||!0,"function"==typeof t?"string"==typeof e?(-1!==_ds.events.indexOf(e)&&t(),document.addEventListener(e,function(e){t(e)},!1)):Array&&Array.isArray(e):console&&console.error&&console.error("_ds.util.listen: callback is not a function")},this.getParam=function(e,t){if(!e||!t)return!1;var n=RegExp("[\\?&]"+e+"=([^&#]*)").exec(t);return n?n[1]:void 0},this.cleanUrl=function(e,t){var n=["userid","user_id","login","username","mail","email","e-mail","user","password"];t&&(n=n.concat(qp));var i=new RegExp("([\\?&]("+n.join("|")+")=)([^&#]*)","ig");e=e.replace(i,"$1removed");return/[?|&|#]$/.test(e)&&(e=e.replace(/[?|&]$/,"")),/.*\?&.*/.test(e)&&(e=e.replace(/\?&/,"?")),e.trim()},this.orderDictDesc=function(e){var t=[],n=!0;for(var i in e)if(looped_item_count=e[i],1==n)t.push(i),n=!1;else{for(var o=!1,a=JSON.parse(JSON.stringify(t)),r=0;r<a.length;r++)if(looped_item_count>e[t[r]]){t.splice(r,0,i),o=!0;break}0==o&&t.push(i)}return t};