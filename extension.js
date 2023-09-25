import GLib from "gi://GLib";
import St from "gi://St";
import Clutter from "gi://Clutter";
import Pango from "gi://Pango";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as main from "resource:///org/gnome/shell/ui/main.js";

let originalClockDisplay;
let formatClockDisplay;
let settings;
let timeoutID = 0;

export default class PanelDateFormatExtension extends Extension {
  /**
   * Enable, called when extension is enabled or when screen is unlocked.
   */
  enable() {
    originalClockDisplay = main.panel.statusArea.dateMenu._clockDisplay;
    formatClockDisplay = new St.Label({ style_class: "clock" });
    formatClockDisplay.clutter_text.y_align = Clutter.ActorAlign.CENTER;
    formatClockDisplay.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
    settings = this.getSettings();

    // FIXME: Set settings first time to make it visible in dconf Editor
    if (!settings.get_string("format")) {
      settings.set_string("format", "%Y.%m.%d %H:%M");
    }

    originalClockDisplay.hide();
    originalClockDisplay
      .get_parent()
      .insert_child_below(formatClockDisplay, originalClockDisplay);
    timeoutID = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, tick);
  }

  /**
   * Disable, called when extension is disabled or when screen is locked.
   */
  disable() {
    GLib.Source.remove(timeoutID);
    timeoutID = 0;
    originalClockDisplay.get_parent().remove_child(formatClockDisplay);
    originalClockDisplay.show();
    settings = null;
    formatClockDisplay = null;
  }
}

/**
 * It runs every time we need to update clock.
 * @return {boolean} Always returns true to loop.
 */
function tick() {
  const format = settings.get_string("format");
  formatClockDisplay.set_text(new GLib.DateTime().format(format));

  return true;
}
