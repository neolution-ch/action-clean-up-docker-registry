# action-clean-up-docker-registry

This action will clean up the docker registry by keeping the specified amount of images with the same tag and deleting all the older ones.

# Usage

See [action.yml](action.yml)

```yaml
steps:
- uses: neolution-ch/action-clean-up-docker-registry@v1
  with:
    registryType: "GoogleContainer"
    dockerImage: "gcr.io/my-project/my-image"
    keepLastTags: 5 # default is 0: unlimited
    continueOnError: false # default
```

# License

[MIT](LICENSE.md)
