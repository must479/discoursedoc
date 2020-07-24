import Controller from "@ember/controller";
import { computed } from "@ember/object";

export default Controller.extend({
  managerRepo: null,
  upgrading: null,

  upgradeAllButtonDisabled: computed(
    "managerRepo.upToDate",
    "allUpToDate",
    function() {
      return !this.get("managerRepo.upToDate") || this.allUpToDate;
    }
  ),

  allUpToDate: computed("model.@each.upToDate", function() {
    return this.model.every(repo => repo.get("upToDate"));
  }),

  actions: {
    upgradeAllButton() {
      this.replaceRoute("upgrade", "all");
    }
  }
});
