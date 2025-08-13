import GLib from "gi://GLib";
import St from "gi://St";
import Clutter from "gi://Clutter";
import Pango from "gi://Pango";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as main from "resource:///org/gnome/shell/ui/main.js";

let clockMap = new Map();
let settings;
let timeoutID = 0;

export default class PanelDateFormatExtension extends Extension {
  /**
   * Enable, called when extension is enabled or when screen is unlocked.
   */
  enable() {
    // log("StatusBar enable");
    if (global.dashToPanel && ! global.dashToPanel._dateTimeformatPanelsCreatedId) {
      global.dashToPanel._dateTimeformatPanelsCreatedId = global.dashToPanel.connect('panels-created', () => enable());
    }

    settings = this.getSettings();

    // FIXME: Set settings first time to make it visible in dconf Editor
    if (!settings.get_string("format")) {
      settings.set_string("format", "%Y.%m.%d %H:%M");
    }

    timeoutID = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, tick);
  }

  /**
   * Disable, called when extension is disabled or when screen is locked.
   */
  disable() {
    GLib.Source.remove(timeoutID);
    timeoutID = 0;

    // log("StatusBar disable");
    eachClock().forEach(clockDisplay => {
      if (clockMap.has(clockDisplay)) {
        let label = clockMap.get(clockDisplay);
        clockMap.delete(clockDisplay);
        clockDisplay.show();
        clockDisplay.get_parent().remove_child(label);
      } else {
        // log(`StatusBar Why isn't clockDisplay in clockMap?! ${JSON.stringify(clockMap)}`);
      }
    });

    if (global.dashToPanel && global.dashToPanel._dateTimeformatPanelsCreatedId) {
      global.dashToPanel.disconnect(global.dashToPanel._dateTimeformatPanelsCreatedId);
      delete global.dashToPanel._dateTimeformatPanelsCreatedId;
    }

    settings = null;
  }
}

/**
 * It runs every time we need to update clock.
 * @return {boolean} Always returns true to loop.
 */
function tick() {
  const format = settings.get_string("format");
  // log("StatusBar update");
  eachClock().forEach(clockDisplay => {
    // log(`StatusBar update clock ${clockDisplay}`);
    let label = clockMap.get(clockDisplay);
    if (!label) {
      // This extension can load before Dash2Panel, so lazily add new panels
      label = new St.Label({ style_class: "clock" });
      label.clutter_text.y_align = Clutter.ActorAlign.CENTER;
      label.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
      clockDisplay.hide();
      clockDisplay.get_parent().insert_child_below(label, clockDisplay);
      clockMap.set(clockDisplay, label);
    }
    label.set_text(new GLib.DateTime().format(format));
  });
  return true;
}

function eachClock() {
  let ret = [];
  let panelArray = global.dashToPanel ? global.dashToPanel.panels.map(pw => pw.panel || pw) : [main.panel];
  let iterLength = panelArray.length;
  for(var index = 0; index < iterLength; index++){
    let panel = panelArray[index];
    ret.push(panel.statusArea.dateMenu._clockDisplay);
  }
  return ret;
}
