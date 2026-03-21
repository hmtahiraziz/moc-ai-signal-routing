import { AiSignalRoutingModule } from "./ai-signal-routing/ai-signal-routing.module";
import { AiSignalRoutingInput } from "./ai-signal-routing/interfaces";

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
