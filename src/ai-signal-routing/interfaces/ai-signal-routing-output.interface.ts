export interface AiSignalRoutingSuccessOutput {
  moduleName: "AI_SIGNAL_ROUTING";
  sourceId: string;
  entityId: string;
  timestamp: string;
  status: "success";
  traceId: string;
  metadata: Record<string, unknown>;
  result: {
    targetModule: "NEXT_MODULE" | "AUDIT_MODULE" | "DEFAULT_MODULE";
  };
}

export interface AiSignalRoutingFailureOutput {
  moduleName: "AI_SIGNAL_ROUTING";
  sourceId: string;
  entityId: string;
  timestamp: string;
  status: "failure";
  traceId: string;
  metadata: Record<string, unknown>;
  error: {
    code: "VALIDATION_ERROR";
    message: string;
    details: {
      field: "payload.type";
      issue: "required";
    };
  };
}

export type AiSignalRoutingOutput =
  | AiSignalRoutingSuccessOutput
  | AiSignalRoutingFailureOutput;
