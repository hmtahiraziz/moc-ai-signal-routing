import { AiSignalRoutingInput } from "./interfaces";
import { AiSignalRoutingService } from "./ai-signal-routing.service";

export class AiSignalRoutingController {
  constructor(private readonly aiSignalRoutingService: AiSignalRoutingService) {}

  handle(input: AiSignalRoutingInput) {
    return this.aiSignalRoutingService.execute(input);
  }
}
