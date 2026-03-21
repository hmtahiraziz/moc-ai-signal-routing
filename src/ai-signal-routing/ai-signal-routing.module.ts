import { AiSignalRoutingController } from "./ai-signal-routing.controller";
import { AiSignalRoutingService } from "./ai-signal-routing.service";

export class AiSignalRoutingModule {
  private readonly service = new AiSignalRoutingService();
  readonly controller = new AiSignalRoutingController(this.service);
}
