import { parseInputs } from "../src/main";
import { expect, describe, test } from "@jest/globals";

const decodedValidBase64 = Buffer.from("valid base64", "utf-8");
const validBase64 = "dmFsaWQgYmFzZTY0";
const invalidBase64 = "NOT VALID BASE64 !@#$%^&*";
const validIpfsPath =
  "/ipfs/bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze/wiki/Aardvark";

describe("parseInputs", () => {
  test("private key must be base64", () => {
    expect(() => {
      parseInputs(invalidBase64, validIpfsPath, true);
    }).toThrow();
  });

  test("does not allow publishing for the first time when the path is unset", () => {
    expect(() => {
      parseInputs(validBase64, "", true);
    }).toThrow();
  });

  test("allows publishing for the first time when the path is set", () => {
    expect(() => {
      parseInputs(validBase64, validIpfsPath, true);
    }).not.toThrow();
  });

  test("an empty path is considered unset", () => {
    expect(parseInputs(validBase64, "", false).newPath).toBeUndefined();
  });

  test("base64-decodes private key", () => {
    expect(parseInputs(validBase64, "", false).privateKey).toEqual(
      decodedValidBase64
    );
  });

  test("a non-empty path is passed through", () => {
    expect(parseInputs(validBase64, validIpfsPath, false).newPath).toEqual(
      validIpfsPath
    );
  });
});
