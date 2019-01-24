/**
 * The Digital-Strategies datalayer and utilities library provides a datalayer, 
 * set of util functions and event bus to help with efficient FE development in 
 * async environments.
 * Major thankyou to Ron Pash for defining the structure for event handling
 */

window._ds = window._ds || {};
window._ds.events = [];

window._ds.util = window._ds || {};
window._ds.util = this;
/**
 * Trigger a GA event via the datalayer and set custom dimensions and/or custom metrics
 * @param {string} category - The GA event category
 * @param {string} action - The GA event action
 * @param {string} [label] - The GA event label
 * @param {string} [value] - The GA event value
 * @param {string} [nonint=true] - Determine if the event is noninteractive (default to true)
 * @param {object} [custom] - An object with custom dimension and/or custom metrics
 * @example
 *
 * //send an event with category, action and label
 * _ds.util.ga_event('category','action','label')
 *
 * //send an event with category, action and custom dimension and custom metric
 * _ds.util.ga_event('category','action', {
 *   'cd1':'value1',
 *   'cm15':'value15'
 * })
 */
this.gaEvent = function (category, action, label, value, nonint, custom) {
  //category and action are required to send an event
  if (!category || !action) {
    return;
  }

  //the data object can be any from the third to the last argument, this sets it right
  if (typeof label == 'object' && !value && !nonint && !custom) {
    data = label;
    label = undefined;
  } else if (typeof value == 'object' && !nonint && !custom) {
    data = value;
    value = undefined;
  } else if (typeof nonint == 'object' && !custom) {
    data = nonint;
    nonint = undefined;
  } else if (typeof custom == 'object') {
    data = custom;
  }
  if (typeof nonint == 'undefined') {
    nonint = true;
  }

  //set the 'static' data
  var dl_data = {
    event: 'ga-event-generic',
    'ga-event-category': category,
    'ga-event-action': action,
    'ga-event-label': label,
    'ga-event-value': value,
    'ga-event-nonInteraction': nonint
  };

  //add custom dimensions and custom metrics
  for (var item in data) {
    if (/^c(d|m)[1-9]($|[0-9]$)/.test(item)) {
      dl_data[item] = data[item];
    }
  }
  dataLayer.push(dl_data);
};
//legacy function name
this.ga_event = this.gaEvent;

/**
 * Function to set a cookie
 * @param {string} cname - The name of the cookie
 * @param {string} cvalue - The value of the cookie
 * @param {integer} [exdays] - The number of days for the cookie to expire
 * @param {string} [path=/] - The path to set the cookie at
 * @param {object} [domain] - The domain to set the cookie at
 * @example
 *
 * //set a cookie with just the name and value
 * _ds.util.setCookie('cookiename','cookievalue');
 *
 * //set a cookie that lasts for 3 days on the main domain
 * _ds.util.setCookie('cookiename','cookievalue',3,'/','www.example.nl');
 */
this.setCookie = function (cname, cvalue, exdays, path, domain) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  path = path || '/';
  var cookie = cname + '=' + cvalue + ';' + expires + ';path=' + path;
  if (domain) {
    cookie = cookie + ';domain=' + domain;
  }
  document.cookie = cookie;
};

/**
 * Function to delete a cookie
 * @param {string} cname - The name of the cookie to delete
 * @param {string} [path=/] - The path of the cookie to delete
 */
this.deleteCookie = function (cname, path) {
  path = path || '/';
  this.setCookie(cname, '', -1, path);
};

/**
 * Function to get a cookie
 * @param {string} cname - The name of the cookie to get
 */
this.getCookie = function (cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
};

/**
 * Function to inject a pixel/img, usually used for marketing pixels
 * @param {string} src - The url of the pixel to inject
 */
this.injPixel = function (src) {
  var p = document.createElement('img');
  p.height = '1';
  p.width = '1';
  p.styl = 'display:none';
  p.alt = '';
  p.src = src;
  document.body.appendChild(p);
};

/**
 * Function to inject an iframe for marketing purposes
 * @param {string} src - The url of the pixel to inject
 */
this.injIframe = function (src) {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.width = '1';
  iframe.height = '1';
  iframe.src = src;
  document.body.appendChild(src);
};

/**
 * Function to inject a javascript file
 * @param {string} src - The url of the pixel to inject
 * @param {requestCallback} [callback] - The callback function
 */
this.injScript = function (src, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = src;
  script.onload = function () {
    if (typeof callback == 'function') {
      callback();
    }
  };
  document.body.appendChild(script);
};

/**
 * Function to listen to dispatched javascript events
 * @param {string} event - The name of the event to listen to
 * @param {requestCallback} callback - The callback function
 * @param {boolean} [historic=true] - Boolean to determine if the callback is triggered on events that were triggered before subscribing
 */
this.listen = function (event, callback, historic) {
  //TO-DO: add listener for multiple events
  //by default also listen to historic events
  historic = historic || true;
  if (typeof callback != 'function') {
    if (console && console.error) {
      console.error('_ds.util.listen: callback is not a function');
    }
    return;
  }
  if (typeof event === 'string') {
    if (_ds.events.indexOf(event) !== -1) {
      callback();
    }
    document.addEventListener(
      event,
      function (e) {
        callback(e);
      },
      false
    );
  } else if (Array && Array.isArray(event)) {
    //
  }
};

/**
 * Function to get the value of a parameter in a url
 * @param {string} paramName - The name of the param to get
 * @param {url} url - The url to check for the param
 * @return {*} 
 */

this.getParam = function (paramName, url) {
  if (!paramName || !url) {
    return false
  }
  var res = RegExp("[\\?\x26]" + paramName + "\x3d([^\x26#]*)").exec(url);
  return res ? res[1] : undefined;

}

/**
 * Function to checks if an element is in viewport
 * type indicates if the element should be partly in view or full.
 * defaults to full. 
 * @param {string} elem - The html element to check
 * @param {boolean} partial - If true, the element only needs to be in the viewport partly  
 */

this.isInViewport = function(elem, partial) {
  var factor = 1;
  if (partial) {
      factor = 1.5;
  }
  var bounding = elem.getBoundingClientRect();
  return (
      bounding.top >= -((window.innerHeight || document.documentElement.clientHeight) / factor) &&
      bounding.left >= 0 &&
      bounding.bottom <= ((window.innerHeight || document.documentElement.clientHeight) * factor) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};



//clean url from e.g. pii
//args: url to clean and query params to filter besides the default
this.cleanUrl = function (url, trailingSlash, addFilterParams) {
  if(!url){
    return undefined;
  }
  // List of query-variable names that need to be removed
  var names = ['userid', 'user_id', 'login', 'username', 'mail', 'email', 'e-mail', 'user','password'];
  if (addFilterParams) {
    names = names.concat(qp);
  }

  // Add trailing slashes, defaults to true
  if(typeof trailingSlash == 'undefined' || trailingSlash === true){
    var regex_trailingslash = new RegExp(/\/?(\?|#|$)/);
    url = url.replace(regex_trailingslash, '/$1');
  }

  var regex_pii = new RegExp("([?&#](" + names.join("|") + ")\x3d)([^&#]*)", "ig");
  url = url.replace(regex_pii, '$1removed');

  // When question mark is directly followed by ampersand, replace with questionmark mark only.
  url = url.replace(/\?&/, '?');

  // When last character results in a '?','&' or '#', remove it too.
  url = url.replace(/[?|&]$/, '');

  // Return the cleaned url, without whitespaces
  return url.trim();
};

this.orderDictDesc = function (obj) {
  var most_viewed;
  var array = [];
  var first = true;
  for (var looped_item in obj) {
    looped_item_count = obj[looped_item];
    if (first == true) {
      array.push(looped_item);
      first = false;
    } else {
      var set = false;
      var array_old = JSON.parse(JSON.stringify(array));
      for (var i = 0; i < array_old.length; i++) {
        if (looped_item_count > obj[array[i]]) {
          array.splice(i, 0, looped_item);
          set = true;
          break;
        } else {
          continue;
        }
      }
      if (set == false) {
        array.push(looped_item);
      }
    }
  }
  return array;
};