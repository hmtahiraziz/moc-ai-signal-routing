import { afterAll, describe, expect, it } from "vitest";
import { AiSignalRoutingService } from "../src/ai-signal-routing/ai-signal-routing.service";
import {
  AiSignalRoutingInput,
  AiSignalRoutingOutput,
  ModuleLog,
} from "../src/ai-signal-routing/interfaces";
import {
  buildScenarioCase,
  writeJsonFile,
  writeSingleFlowProof,
} from "../io/file-writer";

const baseInput: AiSignalRoutingInput = {
  moduleName: "AI_SIGNAL_ROUTING",
  sourceId: "test-source",
  entityId: "entity-001",
  timestamp: "2026-03-21T10:00:00Z",
  status: "success",
  traceId: "trace-test-001",
  metadata: {},
  payload: {
    type: "EXECUTION_FAILED",
  },
};

function makeInput(type?: string): AiSignalRoutingInput {
  return {
    ...baseInput,
    payload: type === undefined ? {} : { type },
  };
}

function assertRequiredLogs(traceId: string, logs: ModuleLog[]): void {
  const expectedEvents = [
    "RECEIVE_INPUT",
    "PROCESS_START",
    "PROCESS_COMPLETE",
    "RETURN_OUTPUT",
  ];

  expect(logs).toHaveLength(4);
  logs.forEach((log, index) => {
    expect(log.event).toBe(expectedEvents[index]);
    expect(log.module).toBe("AI_SIGNAL_ROUTING");
    expect(log.traceId).toBe(traceId);
    expect(typeof log.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(log.timestamp as string))).toBe(false);
  });
}

function saveScenarioLogs(fileName: string, logs: ModuleLog[]): void {
  writeJsonFile("test/logs", fileName, logs);
}

function saveScenarioOutput(
  fileName: string,
  output: AiSignalRoutingOutput,
): void {
  writeJsonFile("test/outputs", fileName, output);
}

function saveAllScenariosProof(): void {
  const service = new AiSignalRoutingService();

  const scenarios = [
    { input: makeInput("EXECUTION_SUCCESS") },
    { input: makeInput("EXECUTION_FAILED") },
    { input: makeInput("UNKNOWN_EVENT") },
    { input: makeInput(undefined) },
  ].map((item) => {
    const result = service.execute(item.input);
    return buildScenarioCase(item.input, result);
  });

  writeSingleFlowProof(scenarios);
}

describe("AI_SIGNAL_ROUTING scenarios", () => {
  it("EXECUTION_SUCCESS routes to NEXT_MODULE", () => {
    const service = new AiSignalRoutingService();
    const input = makeInput("EXECUTION_SUCCESS");
    const { output, logs } = service.execute(input);

    expect(output.status).toBe("success");
    if (output.status === "success") {
      expect(output.result.targetModule).toBe("NEXT_MODULE");
    }
    expect(output.traceId).toBe(input.traceId);
    assertRequiredLogs(input.traceId, logs);
    saveScenarioLogs("execution_success_logs.json", logs);
    saveScenarioOutput("execution_success_output.json", output);
  });

  it("EXECUTION_FAILED routes to AUDIT_MODULE", () => {
    const service = new AiSignalRoutingService();
    const input = makeInput("EXECUTION_FAILED");
    const { output, logs } = service.execute(input);

    expect(output.status).toBe("success");
    if (output.status === "success") {
      expect(output.result.targetModule).toBe("AUDIT_MODULE");
    }
    expect(output.traceId).toBe(input.traceId);
    assertRequiredLogs(input.traceId, logs);
    saveScenarioLogs("execution_failed_logs.json", logs);
    saveScenarioOutput("execution_failed_output.json", output);
  });

  it("unknown type routes to DEFAULT_MODULE", () => {
    const service = new AiSignalRoutingService();
    const input = makeInput("UNKNOWN_EVENT");
    const { output, logs } = service.execute(input);

    expect(output.status).toBe("success");
    if (output.status === "success") {
      expect(output.result.targetModule).toBe("DEFAULT_MODULE");
    }
    expect(output.traceId).toBe(input.traceId);
    assertRequiredLogs(input.traceId, logs);
    saveScenarioLogs("default_route_logs.json", logs);
    saveScenarioOutput("default_route_output.json", output);
  });

  it("missing payload.type returns structured failure", () => {
    const service = new AiSignalRoutingService();
    const input = makeInput(undefined);
    const { output, logs } = service.execute(input);

    expect(output.status).toBe("failure");
    if (output.status === "failure") {
      expect(output.error.code).toBe("VALIDATION_ERROR");
      expect(output.error.message).toBe("Invalid input: payload.type is required");
      expect(output.error.details.field).toBe("payload.type");
      expect(output.error.details.issue).toBe("required");
    }
    expect(output.traceId).toBe(input.traceId);
    assertRequiredLogs(input.traceId, logs);
    saveScenarioLogs("invalid_missing_type_logs.json", logs);
    saveScenarioOutput("invalid_missing_type_output.json", output);
  });
});

afterAll(() => {
  saveAllScenariosProof();
});
