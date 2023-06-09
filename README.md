# linear-app-create-issue-action

GitHub Action to create an Issue for [Linear.app](https://linear.app/).

## Usage

### Input

See [action.yml](./action.yml)

| arg          | description                                                                                                               | required | type    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| issueTitle   | Title of issue                                                                                                            | yes      | string  |
| issueContent | Issue markdown                                                                                                            | yes      | string  |
| apiKey       | API key for Linear.app ([ref](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#personal-api-keys)) | yes      | string  |
| teamId       | Team ID for Linear.app ([ref](#faq-get-teamid-stateid))                                                                   | yes      | string  |
| stateId      | State ID for Linear.app ([ref](#faq-get-teamid-stateid))                                                                  | yes      | string  |

## Usage

### Create Workflow

Create a workflow `.yml` file in your repositories `.github/workflows` directory. An example workflow is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

```yaml
name: Add issues to project

on:
  issues:
    types:
      - opened

jobs:
  add-to-linear:
    name: Add issue to Linear
    runs-on: ubuntu-latest
    steps:
      - uses: jamesacklin/linear-app-create-issue-action@v1
        with:
          issueTitle: ${{ github.event.issue.title }}
          issueContent: ${{ github.event.issue.body }}
          apiKey: ${{ secrets.LINEAR_APIKEY }}
          teamId: ${{ secrets.LINEAR_TEAMID }}
          stateId: ${{ secrets.LINEAR_STATEID }}
```

## FAQ

<a name="faq-get-teamid-stateid"></a>

### How do I get teamId and stateId?

Call the Linear API. An example is shown below using `jq`.

#### teamId

input

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: <Replace this with your Linear API Key>" \
  --data '{ "query": "{ teams { nodes { id name } } }" }' \
  https://api.linear.app/graphql | jq
```

#### stateId

input

```shell
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: <Replace this with your Linear API Key>" \
  --data '{ "query": "{ workflowStates { nodes { id name type } } }" }' \
  https://api.linear.app/graphql | jq
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
