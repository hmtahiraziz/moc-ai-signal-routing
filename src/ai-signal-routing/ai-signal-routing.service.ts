import {
  AiSignalRoutingInput,
  AiSignalRoutingOutput,
  ModuleLog,
} from "./interfaces";

export class AiSignalRoutingService {
  execute(input: AiSignalRoutingInput): { output: AiSignalRoutingOutput; logs: ModuleLog[] } {
    const logs: ModuleLog[] = [];
    logs.push(this.createLog("RECEIVE_INPUT", input.traceId));
    logs.push(this.createLog("PROCESS_START", input.traceId));

    const now = new Date().toISOString();
    let output: AiSignalRoutingOutput;

    if (!input.payload?.type) {
      output = {
        moduleName: input.moduleName,
        sourceId: input.sourceId,
        entityId: input.entityId,
        timestamp: now,
        status: "failure",
        traceId: input.traceId,
        metadata: input.metadata,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input: payload.type is required",
          details: {
            field: "payload.type",
            issue: "required",
          },
        },
      };
    } else {
      const targetModule =
        input.payload.type === "EXECUTION_SUCCESS"
          ? "NEXT_MODULE"
          : input.payload.type === "EXECUTION_FAILED"
            ? "AUDIT_MODULE"
            : "DEFAULT_MODULE";

      output = {
        moduleName: input.moduleName,
        sourceId: input.sourceId,
        entityId: input.entityId,
        timestamp: now,
        status: "success",
        traceId: input.traceId,
        metadata: input.metadata,
        result: {
          targetModule,
        },
      };
    }

    logs.push(this.createLog("PROCESS_COMPLETE", input.traceId));
    logs.push(this.createLog("RETURN_OUTPUT", input.traceId));

    return { output, logs };
  }

  private createLog(event: ModuleLog["event"], traceId: string): ModuleLog {
    return {
      event,
      module: "AI_SIGNAL_ROUTING",
      traceId,
      timestamp: new Date().toISOString(),
    };
  }
}
