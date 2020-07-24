import Discourse from "manager-client/discourse";

export default {
  name: "message-bus",

  initialize() {
    const { MessageBus } = window;
    MessageBus.baseUrl = Discourse.longPollingBaseUrl.replace(/\/$/, "") + "/";

    if (MessageBus.baseUrl !== "/") {
      MessageBus.ajax = function(opts) {
        opts.headers = opts.headers || {};
        opts.headers["X-Shared-Session-Key"] = document
          .querySelector("meta[name=shared_session_key]")
          .getAttribute("content");
        return $.ajax(opts);
      };
    } else {
      MessageBus.baseUrl = Discourse.getAppURL("/");
    }
  }
};
