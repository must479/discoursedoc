import Discourse from "manager-client/discourse";
import Component from "@ember/component";
import { action, computed } from "@ember/object";
import { inject as service } from "@ember/service";

export default Component.extend({
  router: service(),
  tagName: "tr",

  upgradeDisabled: computed(
    "upgradingRepo",
    "repo",
    "managerRepo",
    "managerRepo.upToDate",
    function() {
      const upgradingRepo = this.upgradingRepo;

      if (!upgradingRepo) {
        const managerRepo = this.managerRepo;
        if (!managerRepo) {
          return false;
        }
        return !managerRepo.get("upToDate") && managerRepo !== this.repo;
      }
      return true;
    }
  ),

  officialRepoImageSrc: computed("repo.official", function() {
    if (!this.get("repo.official")) {
      return;
    }
    return Discourse.getAppURL(
      "/plugins/docker_manager/images/font-awesome-check-circle.png"
    );
  }),

  @action
  upgrade() {
    this.router.transitionTo("upgrade", this.repo);
  }
});
