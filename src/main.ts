import * as core from "@actions/core";
import * as Name from "w3name";

interface Inputs {
  privateKey: Uint8Array;
  newPath?: string;
  isInit: boolean;
}

export const publish = async ({
  privateKey,
  newPath,
  isInit,
}: Inputs): Promise<void> => {
  const name = await Name.from(privateKey);

  if (isInit && newPath !== undefined) {
    const revision = await Name.v0(name, newPath);
    await Name.publish(revision, name.key);
  } else {
    const currentRevision = await Name.resolve(name);

    const newRevision = await Name.increment(
      currentRevision,
      newPath ?? currentRevision.value
    );
    await Name.publish(newRevision, name.key);
  }

  core.setOutput("name", name.toString());
};

export const parseInputs = (
  encodedPrivateKey: string,
  newPath: string,
  isInit: boolean
): Inputs => {
  const maybeNewPath = newPath.length === 0 ? undefined : newPath;

  if (isInit && maybeNewPath === undefined) {
    throw new Error(
      "if you specify `init`, then you must also specify a `path`"
    );
  }

  const privateKey = Buffer.from(encodedPrivateKey, "base64");

  if (privateKey.toString("base64") != encodedPrivateKey) {
    throw new Error("the private signing key must be base64-encoded");
  }

  return {
    privateKey,
    newPath: maybeNewPath,
    isInit,
  };
};

const run = async (): Promise<void> => {
  try {
    const encodedPrivateKey = core.getInput("private-key", { required: true });
    const newPath = core.getInput("path", { required: false });
    const isInit = core.getBooleanInput("init", { required: false });

    core.setSecret(encodedPrivateKey);

    await publish(parseInputs(encodedPrivateKey, newPath, isInit));
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};

run();
