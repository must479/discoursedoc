/* global MessageBus, bootbox */
import Repo from "manager-client/models/repo";
import Controller from "@ember/controller";
import { equal } from "@ember/object/computed";
import { action, computed } from "@ember/object";

export default Controller.extend({
  output: null,

  init() {
    this._super();
    this.reset();
  },

  complete: equal("status", "complete"),
  failed: equal("status", "failed"),

  multiUpgrade: computed("model.length", function() {
    return this.get("model.length") !== 1;
  }),

  title: computed("model.@each.name", "multiUpgrade", function() {
    return this.multiUpgrade ? "All" : this.model[0].get("name");
  }),

  isUpToDate: computed("model.@each.upToDate", function() {
    return this.model.every(repo => repo.get("upToDate"));
  }),

  upgrading: computed("model.@each.upgrading", function() {
    return this.model.some(repo => repo.get("upgrading"));
  }),

  repos() {
    const model = this.model;
    return this.isMultiple ? model : [model];
  },

  updateAttribute(key, value, valueIsKey = false) {
    this.model.forEach(repo => {
      value = valueIsKey ? repo.get(value) : value;
      repo.set(key, value);
    });
  },

  messageReceived(msg) {
    switch (msg.type) {
      case "log":
        this.set("output", this.output + msg.value + "\n");
        break;
      case "percent":
        this.set("percent", msg.value);
        break;
      case "status":
        this.set("status", msg.value);

        if (msg.value === "complete") {
          this.model
            .filter(repo => repo.get("upgrading"))
            .forEach(repo => {
              repo.set("version", repo.get("latest.version"));
            });
        }

        if (msg.value === "complete" || msg.value === "failed") {
          this.updateAttribute("upgrading", false);
        }

        break;
    }
  },

  upgradeButtonText: computed("upgrading", function() {
    if (this.upgrading) {
      return "Upgrading...";
    } else {
      return "Start Upgrading";
    }
  }),

  startBus() {
    MessageBus.subscribe("/docker/upgrade", msg => {
      this.messageReceived(msg);
    });
  },

  stopBus() {
    MessageBus.unsubscribe("/docker/upgrade");
  },

  reset() {
    this.setProperties({ output: "", status: null, percent: 0 });
  },

  @action
  start() {
    this.reset();

    if (this.multiUpgrade) {
      this.model
        .filter(repo => !repo.get("upToDate"))
        .forEach(repo => repo.set("upgrading", true));
      return Repo.upgradeAll();
    }

    const repo = this.model[0];
    if (repo.get("upgrading")) {
      return;
    }
    repo.startUpgrade();
  },

  @action
  resetUpgrade() {
    bootbox.confirm(
      "WARNING: You should only reset upgrades that have failed and are not running.\n\n" +
        "This will NOT cancel currently running builds and should only be used as a last resort.",
      result => {
        if (result) {
          if (this.multiUpgrade) {
            return Repo.resetAll(
              this.model.filter(repo => !repo.get("upToDate"))
            ).finally(() => {
              this.reset();
              this.updateAttribute("upgrading", false);
            });
          }

          const repo = this.model[0];
          repo.resetUpgrade().then(() => {
            this.reset();
          });
        }
      }
    );
  }
});
