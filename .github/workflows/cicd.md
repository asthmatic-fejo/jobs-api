# GitHub Action: CI - CD on Tag Push Brief Explanation

This GitHub Action performs a CI/CD pipeline triggered **only when a tag is pushed**. 

Here is what it does step by step:

1. **Triggers only on tag pushes.**
2. **Checks out the repository** to the runner.
3. **Sets up Docker Buildx** to enable advanced Docker build features.
4. **Builds a Docker image** tagged with the pushed tag name.
    - If the tag follows the SemVer format (`vX.Y.Z`), it also tags the image as `latest`.
5. **Logs into Docker Hub** using secrets stored in the repository.
6. **Pushes the Docker image** to Docker Hub.
    - If it's a SemVer tag, it also pushes the `latest` tag.
7. **Triggers a deployment via Render API** only if the tag is SemVer.
    - Outputs a success or error message based on the HTTP response.

> This workflow ensures that deployments and Docker pushes are only made when a versioned release tag (e.g., `v1.0.0`) is created.

Everything is done using GitHub Secrets on the repo.
