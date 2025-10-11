import GLib from "gi://GLib";
import St from "gi://St";
import Clutter from "gi://Clutter";
import Pango from "gi://Pango";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as main from "resource:///org/gnome/shell/ui/main.js";

export default class PanelDateFormatExtension extends Extension {
  _clockSignal;
  _clockMap;

  /**
   * Enable, called when extension is enabled or when screen is unlocked.
   */
  enable() {
    // WORKAROUND:
    //  Set settings for the first time to make it visible in dconf editor
    //  Please note schema default value must be empty string
    if (!this.getSettings().get_string("format")) {
      this.getSettings().set_string("format", "%Y.%m.%d %H:%M");
    }

    this._clockMap = new Map();
    this._clockSignal = main.panel.statusArea.dateMenu._clock.connect(
      "notify::clock",
      this._tick
    );
    this._tick();
  }

  /**
   * Disable, called when extension is disabled or when screen is locked.
   */
  disable() {
    main.panel.statusArea.dateMenu._clock.disconnect(this._clockSignal);
    this._clockSignal = undefined;

    this._clockMap.forEach((label, clockDisplay) => {
      clockDisplay.show();
      clockDisplay.get_parent().remove_child(label);
      label.destroy();
    });
    this._clockMap = undefined;
  }

  /**
   * It runs every time we need to update clock.
   * @return {boolean} Always returns true to loop.
   */
  _tick = () => {
    const format = this.getSettings().get_string("format");
    const text = new GLib.DateTime().format(format);
    this._clocks().forEach((clockDisplay) => {
      let label = this._clockMap.get(clockDisplay);
      if (!label) {
        label = new St.Label({ style_class: "clock" });
        label.clutter_text.y_align = Clutter.ActorAlign.CENTER;
        label.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        clockDisplay.hide();
        clockDisplay.get_parent().insert_child_below(label, clockDisplay);
        this._clockMap.set(clockDisplay, label);
      }
      label.set_text(text);
    });
    return true;
  };

  _clocks() {
    return [
      main.panel,
      ...(global.dashToPanel?.panels.map((pw) => pw.panel) ?? []),
    ].map((panel) => panel.statusArea.dateMenu._clockDisplay);
  }
}
