var UserProfile = (function() {
    var full_name = "Huesos";
    var token = ""
  
    var setToken = function(_token) {
        token = _token
    }

    var getToken = function() {
        return token;
    }

    var getName = function() {
      return full_name;
    };
  
    var setName = function(name) {
      full_name = name;     
    };
  
    return {
      getName: getName,
      setName: setName,
      getToken: getToken,
      setToken: setToken
    }
  
  })();
  
export default UserProfile;