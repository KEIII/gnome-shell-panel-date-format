pack:
	gnome-extensions pack --force \
		--extra-source=icon.svg \
		--extra-source=LICENSE \
		--extra-source=README.md

release:
	@current=$$(jq -r '.["version-name"]' metadata.json); \
	ver=$$((current + 1)); \
	echo "Updating from v$$current to v$$ver"; \
	jq ".[\"version-name\"] = \"$$ver\"" metadata.json > tmp.json && mv tmp.json metadata.json; \
	git add metadata.json; \
	git commit -m "v$$ver" && git tag "v$$ver" && git push --follow-tags
