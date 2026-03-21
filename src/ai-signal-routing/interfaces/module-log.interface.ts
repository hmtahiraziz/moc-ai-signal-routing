export interface ModuleLog {
  event:
    | "RECEIVE_INPUT"
    | "PROCESS_START"
    | "PROCESS_COMPLETE"
    | "RETURN_OUTPUT";
  module: "AI_SIGNAL_ROUTING";
  traceId: string;
  timestamp: string;
}
