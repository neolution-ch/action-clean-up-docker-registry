import * as core from "@actions/core";
import * as exec from "@actions/exec";

interface GoogleContainerImage {
  digest: string;
  tags: string[];
  timestamp?: Timestamp;
}

interface Timestamp {
  datetime: Date;
  day: number;
  fold: number;
  hour: number;
  microsecond: number;
  minute: number;
  month: number;
  second: number;
  year: number;
}

const jsonDateReviver = (_key: string, value: unknown): unknown => {
  const reISO = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.{0,1}\d*))(?:Z|(\+|-)([\d|:]*))?$/;

  if (typeof value === "string" && reISO.exec(value)) {
    return new Date(value);
  }

  return value;
};

/**
 * The main entry point
 */
async function run(): Promise<void> {
  let continueOnError = false;
  try {
    continueOnError = core.getBooleanInput("continueOnError");

    const registryType = core.getInput("registryType", { required: true });

    if (registryType === "GoogleContainer") {
      const dockerImage = core.getInput("dockerImage", { required: true });

      const args = ["container", "images", "list-tags", dockerImage, "--format", "json"];
      const { stdout: output } = await exec.getExecOutput("gcloud", args, { silent: true });

      core.info("----------------------------------------");
      core.info(output);
      core.info("----------------------------------------");

      const images = JSON.parse(output, jsonDateReviver) as GoogleContainerImage[];
      core.info("Parsed json");
      core.info("----------------------------------------");
      for (const image of images) {
        core.info(`Digest: ${image.digest}`);
        core.info("tags:");
        for (const tag of image.tags) {
          core.info(` - ${tag}`);
        }
        core.info(`Timestamp: ${image.timestamp ? image.timestamp.datetime.toUTCString() : "null"}`);
        core.info("----------------------------------------");
      }
    } else if (registryType === "GoogleArtifact") {
      throw new Error("Not implemented yet");
    } else if (registryType === "AzureContainer") {
      throw new Error("Not implemented yet");
    } else {
      throw new Error(`Unknown registry type: ${registryType}`);
    }
  } catch (error) {
    if (continueOnError) {
      core.error(error as string);
    } else if (error instanceof Error) {
      core.setFailed(error);
    } else {
      core.setFailed(`Unexpected error: ${error as string}`);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
