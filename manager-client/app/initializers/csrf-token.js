import $ from "jquery";
import Discourse from "manager-client/discourse";

export default {
  name: "findCsrfToken",

  initialize() {
    return $.ajax(Discourse.getAppURL("/session/csrf")).then(result => {
      const token = result.csrf;
      $.ajaxPrefilter((options, originalOptions, xhr) => {
        if (!options.crossDomain) {
          xhr.setRequestHeader("X-CSRF-Token", token);
        }
      });
    });
  }
};
