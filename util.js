window._ds||( window._ds={} );
window._ds.events = [];
window._ds.util = {
  //trigger a GA event via the datalayer
	ga_event: function(category,action,label,value,noninteraction){
      if(!category || !action){ return; }
      dataLayer.push({
        'event': 'ga-event-generic',
        'ga-event-category': category,
        'ga-event-action': action,
       	'ga-event-label': label,
        'ga-event-value': value,
        'ga-event-nonInteraction': noninteraction
      });
    },

  //set a cookie
  setCookie: function(cname, cvalue, exdays, path, domain){
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires="+d.toUTCString();
      path = path || '/';
      var cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path;
      if(domain){cookie = cookie + ";domain=" + domain;}
      document.cookie = cookie;
    },

  //delete a cookie
  deleteCookie: function(cname, path){
      path = path || '/';
      this.setCookie(cname,'', -1,path);
    },

  //get the value of a specific cookie
  getCookie: function(cname){
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') { c = c.substring(1); }
          if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
      }
      return undefined;
    },

  //inject marketing pixel
  injPixel: function(src){
      var p = document.createElement('img');
      p.height = '1';
      p.width = '1';
      p.styl = 'display:none';
      p.alt = '';
      p.src = src;
      document.body.appendChild(p);
    },

  //inject marketing pixel as iframe
  injIframe: function(src){
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.width = '1';
      iframe.height = '1';
      iframe.src = src;
      document.body.appendChild(src);
    },

  //inject a javascript
  injScript: function(src, callback){
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = src;
      script.onload = function(){
          if(typeof(callback) == 'function'){ callback(); }
      };
      document.body.appendChild(script);
    },

  //listen to dispatched events
  listen: function(event, callback, historic){
      //TO-DO: add listener for multiple events
      //by default also listen to historic events
      historic = historic || true;
      if(typeof(callback) != 'function'){if(console && console.error){console.error('_ds.util.listen: callback is not a function');}}
      if(typeof(event) === 'string'){
        if(_ds.events.indexOf(event) !== -1){ callback(); }
        document.addEventListener(event, function (e) { callback(e); }, false);
      }else if(Array && Array.isArray(event)){
        //
      }
    },

  //clean url from e.g. pii
  //args: url to clean and query params to filter besides the default
  cleanUrl: function(url,qp){
      // list of query-variable names that need to be removed. removal regex is case-INSENSITIVE
      var names = ['user_id','login','username','mail','email','e-mail','user'];
      names = names.concat(qp);
      names.forEach(function(n){
        var rgx1 = new RegExp('&'+n+'=[^&]+','ig'); 
        var rgx2 = new RegExp('\\?'+n+'=[^&]+','i');
        // check for '&name=', case insensitive and repeating
        if(rgx1.test(url)) url = url.replace((rgx1),'');
        // check for '?name=', case insensitive, only once
        else if(rgx2.test(url)) url = url.replace(rgx2,'?');
      });
      // replace email (if any are left) via regex with 'email@removed'
      if(/[@|%40]/.test(url)) url = url.replace(/(%3d|%3D|=|\/)([a-zA-Z0-9.!#$*+=?^_`{|}~-]+(%40|@)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)(%26|&|\/|$)/g, '$1email$3removed$4');
      // when last character results in a '?' or '&', remove it too.
      if(/[?|&]$/.test(url)) url = url.replace(/[?|&]$/,'');
      // when question mark is directly followed by ampersand, replace with question mark only.
      if(/.*\?&.*/.test(url)) url = url.replace(/\?&/,'?');
      // return the cleaned url, without whitespaces
      return url.trim();
    }
  
};