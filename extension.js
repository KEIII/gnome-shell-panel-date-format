const GLib = imports.gi.GLib;
const St = imports.gi.St;
const main = imports.ui.main;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

let originalClockDisplay;
let formatClockDisplay;
let settings;
let timeoutID = 0;

/**
 * Initialising function which will be invoked at most once directly after your source JS file is loaded.
 */
function init() {
  originalClockDisplay = main.panel.statusArea.dateMenu._clockDisplay;
  formatClockDisplay = new St.Label({
    y_align: Clutter.ActorAlign.CENTER,
  });
  settings = Convenience.getSettings();

  // FIXME: Set settings first time to make it visible in dconf Editor
  if (!settings.get_string('format')) {
    settings.set_string('format', '%Y.%m.%d %H:%M');
  }
}

/**
 * Enable, called when extension is enabled or when screen is unlocked.
 */
function enable() {
  originalClockDisplay.hide();
  originalClockDisplay.get_parent().insert_child_below(formatClockDisplay, originalClockDisplay);
  timeoutID = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, tick);
}

/**
 * Disable, called when extension is disabled or when screen is locked.
 */
function disable() {
  GLib.Source.remove(timeoutID);
  timeoutID = 0;
  originalClockDisplay.get_parent().remove_child(formatClockDisplay);
  originalClockDisplay.show();
}

/**
 * It runs every time we need to update clock.
 * @return {boolean} Always returns true to loop.
 */
function tick() {
  const format = settings.get_string('format');
  formatClockDisplay.set_text(new Date().toLocaleFormat(format));

  return true;
}
