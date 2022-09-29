import * as core from "@actions/core";
import * as Name from "w3name";

const publish = async (
  privateKey: Uint8Array,
  isInit: boolean,
  newPath?: string
): Promise<void> => {
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

const run = async (): Promise<void> => {
  const encodedPrivateKey = core.getInput("private-key", { required: true });
  const newPath = core.getInput("path", { required: false });
  const isInit = core.getBooleanInput("init", { required: false });

  core.setSecret(encodedPrivateKey);

  const maybeNewPath = newPath.length === 0 ? undefined : newPath;

  if (isInit && maybeNewPath === undefined) {
    core.setFailed(
      "If you specify `init`, then you must also specify a `path`."
    );
    return;
  }

  const privateKey = Buffer.from(encodedPrivateKey, "base64");

  try {
    await publish(privateKey, isInit, maybeNewPath);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};

run();
