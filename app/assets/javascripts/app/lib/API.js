var request = function (method) {
  return function (url, data, cb) {
    var cb = _.isFunction(data) ? data : cb;

    return $.ajax({
      url: url,
      type: method,
      data: data,
      headers: { 'Authorization': "Token token=" + window.API_KEY}
    }).done(function(res){
      if (cb) {
        cb(null, res);  
      }
    }).fail(function(xhr, err, msg){
      if (cb) { 
        cb(err);  
      }
    });
  };
}

module.exports = {

  get: request('GET'),

  post: request('POST'),

  put: request('PUT'),

  del: request('DELETE')
};