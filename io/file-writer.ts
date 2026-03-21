import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  AiSignalRoutingInput,
  AiSignalRoutingOutput,
  ModuleLog,
} from "../src/ai-signal-routing/interfaces";

export interface ScenarioCase {
  caseType: "success" | "failed_route" | "default" | "failure";
  input: AiSignalRoutingInput;
  output: AiSignalRoutingOutput;
  logs: ModuleLog[];
}

export function deriveCaseType(
  input: AiSignalRoutingInput,
  output: AiSignalRoutingOutput,
): ScenarioCase["caseType"] {
  if (output.status === "failure") {
    return "failure";
  }
  if (input.payload?.type === "EXECUTION_SUCCESS") {
    return "success";
  }
  if (input.payload?.type === "EXECUTION_FAILED") {
    return "failed_route";
  }
  return "default";
}

export function buildScenarioCase(
  input: AiSignalRoutingInput,
  result: { output: AiSignalRoutingOutput; logs: ModuleLog[] },
): ScenarioCase {
  return {
    caseType: deriveCaseType(input, result.output),
    input,
    output: result.output,
    logs: result.logs,
  };
}

export function writeJsonFile(
  directory: string,
  fileName: string,
  data: unknown,
): void {
  const targetDir = resolve(process.cwd(), directory);
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(resolve(targetDir, fileName), JSON.stringify(data, null, 2));
}

export function writeSingleFlowProof(cases: ScenarioCase[]): void {
  writeJsonFile("proof", "single_flow_proof.json", {
    flow: "input -> output -> logs",
    cases,
  });
}
