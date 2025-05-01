# CI / CD Brief Explanation

This GHA Always tries to build & push the image using the tag name, but also...

If it is a [SemVer Tag] (https://semver.org/) :
1. TODO: It should verify de test coverage and properly output (run ok).
2. Tags the current versions as 'latest' too.
3. Pushes the 'latest' tag.
4. Refreshes the Render Service to update changes. 
