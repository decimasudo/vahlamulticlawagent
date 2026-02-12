# CONTRIBUTION PROTOCOL v1.0

## 1. OVERVIEW
This repository hosts the source code for the VAHLA Mk-I Neural Agent Framework. Due to the integration with ClawsSec security protocols and the modular agent architecture, all contributions must adhere to strict quality control and security standards. Unauthorized or insecure code injection will result in immediate rejection.

## 2. SECURITY CLEARANCE & REPORTING
Security anomalies or critical system failures must be reported via encrypted channels immediately. Do not disclose vulnerability details in public channels.

### 2.1 SECURITY REPORTING (ISSUES)
When filing a security report, ensure the following telemetry is included:
* System Version (Target Environment)
* Agent Load (Memory/CPU Usage)
* Reproduction Steps (Agent Configuration Sequence)

## 3. SUBMISSION GUIDELINES (PULL REQUESTS)
All patches must be submitted via Pull Request (PR) to the `main` branch. Direct commits are prohibited by security interlocks.

### 3.1 CODING STANDARDS
Contributors are expected to adhere to the following architecture-specific protocols:

#### A. AGENT SKILLS CORE (JavaScript/TypeScript)
* **Type Safety:** Strict TypeScript usage is mandatory for all agent processing units.
* **Async Handling:** All agent operations must be properly awaited.
* **Documentation:** JSDoc comments must explain the agent's utility and security implications.

#### B. DATA PERSISTENCE LAYER (Supabase)
* **Security First:** All database operations must respect RLS policies.
* **Input Validation:** Sanitize all user inputs before database operations.
* **Error Handling:** Never expose sensitive database errors to the client.

#### C. INTERFACE LAYER (Next.js)
* **Performance:** UI rendering must maintain smooth performance under load.
* **Security:** Implement proper authentication checks for all agent operations.
* **Clean Code:** Strictly separate UI logic from agent processing.

## 4. REVIEW PROCESS
1.  **Security Scan:** Automated ClawsSec scans will verify security integrity.
2.  **Code Review:** Contributors will verify architectural compliance.
3.  **Testing:** Code will be tested in the development environment.

## 5. LEGAL
By submitting a patch, you grant the governing entity an irrevocable license to use, modify, and deploy the code in secure AI environments.