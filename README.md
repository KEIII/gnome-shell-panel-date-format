# Panel Date Format extension for Gnome Shell.

Allows to customize the date format on the panel.

![screenshot](./screenshot.png?raw=true)

## Changing format

You can use dconf Editor to change format. Or simply from the terminal:

```sh
dconf write /org/gnome/shell/extensions/panel-date-format/format "'%Y-%m-%d'"
```

[Syntax](https://developer.gnome.org/glib/stable/glib-GDateTime.html#g-date-time-format)
