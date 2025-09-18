TARGET = "panel-date-format@keiii.github.com.zip"

DIST_FILES = \
	schemas/ \
	extension.js \
	icon.svg \
	LICENSE \
	metadata.json \
	README.md

release:
	zip -r $(TARGET) $(DIST_FILES)
