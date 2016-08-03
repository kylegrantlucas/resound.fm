module.exports = function (curUser) {
  Rollbar.configure({payload: {
    
    person: {
      id: curUser.id, 
      username: curUser.username, 
      first_name: curUser.first_name, 
      last_name: curUser.last_name}
    },

    client: {
      javascript: {
        //code_version: "ce0227180bd7429fde128f6ef8fad77396d8fbd4",  // Git SHA of your deployed code
        source_map_enabled: true,
        guess_uncaught_frames: true
      }
    }

  });
};