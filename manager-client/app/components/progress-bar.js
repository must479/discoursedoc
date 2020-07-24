import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  classNameBindings: [":progress", ":progress-striped", "active"],

  active: computed("percent", function() {
    return parseInt(this.percent, 10) !== 100;
  }),

  barStyle: computed("percent", function() {
    let percent = parseInt(this.percent, 10);
    if (percent > 0) {
      if (percent > 100) {
        percent = 100;
      }
      return ("width: " + this.percent + "%").htmlSafe();
    }

    return "".htmlSafe();
  })
});
