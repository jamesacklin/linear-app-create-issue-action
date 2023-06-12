import { LinearClient } from "@linear/sdk";

// eslint-disable-next-line node/no-missing-import
import { IssueCreateInput } from "@linear/sdk/dist/_generated_documents";

export class UndefinedError extends Error {
  constructor(content: string) {
    super();
    this.name = "UndefinedError";
    this.message = `${content} is undefined`;
  }
}

type IssueData = { [key: string]: unknown; title: string };

export class Linear {
  private client: LinearClient;
  private issueData?: IssueData;

  constructor(
    private apiKey: string,
    private teamId: string,
    private stateId: string
  ) {
    this.client = new LinearClient({ apiKey });
  }

  async createIssue(issueData?: IssueData) {
    let inputIssueData = issueData;
    if (inputIssueData === undefined) {
      inputIssueData = this.issueData;
    }

    if (inputIssueData === undefined) {
      throw new UndefinedError("IssueData");
    }

    const issueCreateInput: IssueCreateInput = {
      teamId: this.teamId,
      stateId: this.stateId,
      ...inputIssueData,
    };

    return this.client.issueCreate(issueCreateInput);
  }

  readData(
    title: string,
    reporter: string,
    url: string,
    data: string | Buffer
  ): IssueData {
    const description = `${data}\n\nReporter: @${reporter}\nURL: ${url}`;
    this.issueData = {
      title,
      description,
    };

    return this.issueData;
  }
}
