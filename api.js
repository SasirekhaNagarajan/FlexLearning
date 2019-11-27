function getJSON(method, api, asyncFlag) {
    var xhr = new XMLHttpRequest();
    return new Promise(function(resolve, reject) {
     xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status >= 300) {
            reject("Error, status code = " + xhr.status);
          } else {
            resolve(xhr.responseText);
          }
        }
      }
      xhr.open(method, api, asyncFlag);
      xhr.send();
    });
  }