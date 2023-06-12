import { getInput, setFailed, info } from "@actions/core";
import { Linear, UndefinedError } from "./Linear";

async function main(
  issueTitle: string,
  issueContent: string,
  issueReporter: string,
  issueUrl: string,
  apiKey: string,
  teamId: string,
  stateId: string
) {
  if (apiKey === undefined || apiKey === "") {
    throw new UndefinedError("apiKey");
  }
  if (teamId === undefined || teamId === "") {
    throw new UndefinedError("teamId");
  }
  if (stateId === undefined || stateId === "") {
    throw new UndefinedError("stateId");
  }

  const client = new Linear(apiKey, teamId, stateId);

  info(`--- create issue ---`);
  const data = issueContent;
  const issueData = client.readData(issueTitle, issueReporter, issueUrl, data);
  info(JSON.stringify(issueData, null, 2));

  const result = await client.createIssue();
  info(`--- result ${issueContent} ---`);
  info(JSON.stringify(result, null, 2));
  info(`--- done ${issueContent} ---`);
}

async function run(): Promise<void> {
  try {
    const issueTitle: string = getInput("issueTitle");
    const issueContent: string = getInput("issueContent");
    const issueReporter: string = getInput("issueReporter");
    const issueUrl: string = getInput("issueUrl");
    const apiKey: string = getInput("apiKey");
    const teamId: string = getInput("teamId");
    const stateId: string = getInput("stateId");

    await main(
      issueTitle,
      issueContent,
      issueReporter,
      issueUrl,
      apiKey,
      teamId,
      stateId
    );
  } catch (error: any) {
    setFailed(error.message);
  }
}

run();
