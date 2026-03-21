export interface AiSignalRoutingInput {
  moduleName: "AI_SIGNAL_ROUTING";
  sourceId: string;
  entityId: string;
  timestamp: string;
  status: "success";
  traceId: string;
  metadata: Record<string, unknown>;
  payload?: {
    type?: string;
  };
}
