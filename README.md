# AI_SIGNAL_ROUTING Module

This repository implements `AI_SIGNAL_ROUTING` with strict MOC contracts, required logs, and scenario-based automated tests.

## Current Repository Structure

- `io/`
  - `file-writer.ts` (generic artifact/proof file writing utilities)
- `src/`
  - module implementation (`controller`, `service`, `module`, `interfaces`)
  - `main.ts` executes scenarios and delegates all writing to `io/file-writer.ts`
- `examples/`
  - `input.json`
  - `expected_output.json`
- `outputs/` (generated on every `npm run start`)
  - `valid_case_output.json`
  - `invalid_case_output.json`
- `logs/` (generated on every `npm run start`)
  - `valid_case_logs.json`
  - `invalid_case_logs.json`
- `proof/` (generated on every `npm run start`)
  - `single_flow_proof.json` (all scenarios in one file: input -> output -> logs)
- `test/`
  - `ai-signal-routing.scenarios.spec.ts`
  - `logs/` (generated on every `npm test`)
  - `outputs/` (generated on every `npm test`)

## Routing Rules

- `EXECUTION_SUCCESS` -> `NEXT_MODULE`
- `EXECUTION_FAILED` -> `AUDIT_MODULE`
- default -> `DEFAULT_MODULE`

## Required Logs

Each execution includes:

- `RECEIVE_INPUT`
- `PROCESS_START`
- `PROCESS_COMPLETE`
- `RETURN_OUTPUT`

Each log entry contains:

- `module`
- `traceId`
- `timestamp`

## Run

```bash
npm install
npm run start
```

`npm run start` prints end-to-end proof JSON:

- valid case: input -> output -> logs
- invalid case (missing `payload.type`): output -> logs
- updates root proof files on every run:
  - `outputs/valid_case_output.json`
  - `outputs/invalid_case_output.json`
  - `logs/valid_case_logs.json`
  - `logs/invalid_case_logs.json`
  - `proof/single_flow_proof.json`

`proof/single_flow_proof.json` is dynamic and includes all scenario cases with:

- `caseType` (derived from input/output: `success`, `failed_route`, `default`, `failure`)
- `input`
- `output`
- `logs`

## Test

```bash
npm test
```

This runs one scenario test file:

- `test/ai-signal-routing.scenarios.spec.ts`

Covered scenarios:

- `EXECUTION_SUCCESS` routes to `NEXT_MODULE`
- `EXECUTION_FAILED` routes to `AUDIT_MODULE`
- unknown type routes to `DEFAULT_MODULE`
- missing `payload.type` returns `status: failure` with structured error
- required log sequence and required log fields are validated

Each `npm test` run also updates:

- `test/logs/execution_success_logs.json`
- `test/logs/execution_failed_logs.json`
- `test/logs/default_route_logs.json`
- `test/logs/invalid_missing_type_logs.json`
- `test/outputs/execution_success_output.json`
- `test/outputs/execution_failed_output.json`
- `test/outputs/default_route_output.json`
- `test/outputs/invalid_missing_type_output.json`
- `proof/single_flow_proof.json` (same all-scenarios consolidated proof)

Optional: generate Vitest run artifacts: