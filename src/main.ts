import { AiSignalRoutingModule } from "./ai-signal-routing/ai-signal-routing.module";
import { AiSignalRoutingInput } from "./ai-signal-routing/interfaces";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const moduleRef = new AiSignalRoutingModule();

const validInput: AiSignalRoutingInput = {
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

const invalidInput: AiSignalRoutingInput = {
  moduleName: "AI_SIGNAL_ROUTING",
  sourceId: "test-source",
  entityId: "entity-001",
  timestamp: "2026-03-21T10:00:00Z",
  status: "success",
  traceId: "trace-test-001",
  metadata: {},
  payload: {},
};

const validResult = moduleRef.controller.handle(validInput);
const invalidResult = moduleRef.controller.handle(invalidInput);

const logsDir = resolve(process.cwd(), "logs");
mkdirSync(logsDir, { recursive: true });
writeFileSync(
  resolve(logsDir, "valid_case_logs.json"),
  JSON.stringify(validResult.logs, null, 2),
);
writeFileSync(
  resolve(logsDir, "invalid_case_logs.json"),
  JSON.stringify(invalidResult.logs, null, 2),
);

const outputsDir = resolve(process.cwd(), "outputs");
mkdirSync(outputsDir, { recursive: true });
writeFileSync(
  resolve(outputsDir, "valid_case_output.json"),
  JSON.stringify(validResult.output, null, 2),
);
writeFileSync(
  resolve(outputsDir, "invalid_case_output.json"),
  JSON.stringify(invalidResult.output, null, 2),
);

console.log(
  JSON.stringify(
    {
      proof: {
        validCase: {
          input: validInput,
          output: validResult.output,
          logs: validResult.logs,
        },
        invalidCase: {
          input: invalidInput,
          output: invalidResult.output,
          logs: invalidResult.logs,
        },
      },
    },
    null,
    2,
  ),
);
