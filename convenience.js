const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const GioSSS = Gio.SettingsSchemaSource;

/**
 * Builds and return a GSettings schema, using schema files
 * in extensionsdir/schemas.
 */
function getSettings() {
  const schema = Me.metadata['settings-schema'];

  // check if this extension was built with "make zip-file", and thus
  // has the schema files in a subfolder
  // otherwise assume that extension has been installed in the
  // same prefix as gnome-shell (and therefore schemas are available
  // in the standard folders)
  const schemaDir = Me.dir.get_child('schemas');
  const schemaSource = schemaDir.query_exists(null)
    ? GioSSS.new_from_directory(schemaDir.get_path(), GioSSS.get_default(), false)
    : GioSSS.get_default();

  const schemaObj = schemaSource.lookup(schema, true);
  if (!schemaObj) {
    throw new Error('Schema ' + schema + ' could not be found for extension '
      + Me.metadata.uuid + '. Please check your installation.');
  }

  return new Gio.Settings({settings_schema: schemaObj});
}
