import { getInput, setFailed, info } from "@actions/core";
import { Linear, UndefinedError } from "./Linear";
import { parseEmbed } from "./util";

async function main(
  issueTitle: string,
  issueContent: string,
  apiKey: string,
  teamId: string,
  stateId: string,
  isDryrun: boolean,
  embed: string
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

  const replaceRecords = parseEmbed(embed);
  info("--- view embed ---");
  info(JSON.stringify(replaceRecords, null, 2));

  const client = new Linear(apiKey, teamId, stateId, isDryrun);

  info(`--- create issue ---`);
  const data = issueContent;
  const issueData = client.readData(issueTitle, data, replaceRecords);
  info(JSON.stringify(issueData, null, 2));

  if (isDryrun) {
    info(`--- !!DRYRUN!! ---`);
  }
  const result = await client.createIssue();
  info(`--- result ${issueContent} ---`);
  info(JSON.stringify(result, null, 2));
  info(`--- done ${issueContent} ---`);
}

async function run(): Promise<void> {
  try {
    const issueTitle: string = getInput("issueTitle");
    const issueContent: string = getInput("issueContent");
    const apiKey: string = getInput("apiKey");
    const teamId: string = getInput("teamId");
    const stateId: string = getInput("stateId");
    const isDryrun: boolean = Boolean(getInput("isDryrun"));
    const embed: string = getInput("embed");

    await main(
      issueTitle,
      issueContent,
      apiKey,
      teamId,
      stateId,
      isDryrun,
      embed
    );
  } catch (error: any) {
    setFailed(error.message);
  }
}

run();
