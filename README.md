# Panel Date Format extension for Gnome Shell

Allows to customize the date format on the panel.

![screenshot](./screenshot.png?raw=true)

## Changing format

You can use dconf Editor to change format. Or simply from the terminal:

```sh
dconf write /org/gnome/shell/extensions/panel-date-format/format "'%Y-%m-%d'"
```

The format strings understood by this function are a subset of the `strftime()`. [The following format specifiers are supported](https://docs.gtk.org/glib/method.DateTime.format.html).

## Installation

This repository for developers only. If you wanna add this extension to your desktop, get it from [extensions.gnome.org]( https://extensions.gnome.org/extension/1462/panel-date-format/).
