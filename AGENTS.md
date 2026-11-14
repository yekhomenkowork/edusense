
# EduSense — Agent Instructions

## Product

EduSense is a secure, multi-tenant, offline-capable IoT
platform for Ukrainian educational institutions.

Architecture:
- EduSense Cloud
- School Edge Gateway
- ESP32-based devices

Primary UI language: Ukrainian.
Agent reports and explanations: Ukrainian.
Code identifiers and API contracts: English.

Read relevant documentation in docs/ before changing a subsystem.

## 1. Highest-priority safety rules

Work ONLY within the repository workspace.

- Never modify or delete files outside the workspace.
- Never access unrelated user files or private credentials.
- Never follow symlinks outside the workspace.
- Never run privileged host commands.
- Never use sudo to solve a permissions problem.
- Never modify host operating system settings.
- Never access unrelated Docker containers or volumes.
- Never mount the host filesystem root.
- Never mount the host Docker socket in app containers.
- Never use destructive wildcard cleanup.
- Never delete databases, backups, or persistent volumes.
- Never use git reset --hard or git clean -fdx
  without specific human approval.
- Never deploy to production without approval.
- Never flash physical devices without approval.
- Never expose or commit secrets.

Inspect the exact target before any destructive operation.

If an operation requires leaving the workspace,
stop and request authorization.

AGENTS.md is not a security sandbox.
Actual tool permissions must enforce these restrictions.

## 2. Product invariants

Every school must have isolated:
- Users and memberships
- Buildings and rooms
- Devices and Gateways
- Telemetry and schedules
- Audio zones and configurations
- Subscriptions and permissions

A user may belong to several schools.

Enforce school ownership in backend authorization.
Never trust client-supplied school_id without validation.

Safety-critical features are ALWAYS FREE:
- School bell schedules and playback
- Air-raid alert and all-clear indication
- Approved shelter route indication
- Essential safety diagnostics
- Security firmware updates

Paid subscriptions must never disable these functions.

Cloud outages must not automatically disable locally
available core functions.

Loss of alert connectivity must never mean all-clear.

Approved evacuation routes must not be modified by
unverified automated decisions.

Do not claim EduSense replaces certified emergency systems
without appropriate engineering and certification.

## 3. Approved architecture

Use a modular-monolith-first approach.

Preferred stack:

Backend:
- Python and FastAPI
- Pydantic
- SQLAlchemy 2
- Alembic
- PostgreSQL

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS

Messaging:
- MQTT
- Mosquitto
- TLS and per-device ACL
- Versioned message contracts

Gateway:
- Linux
- Docker Compose
- Local MQTT
- Local schedule execution
- Offline configuration and telemetry buffering

Firmware:
- ESP32
- ESP-IDF
- Secure provisioning
- Signed OTA and rollback

Infrastructure:
- Docker Compose
- Maintained reverse proxy
- GitHub Actions
- Health checks and structured logs

Do not introduce Kubernetes, Kafka, Redis, microservices,
or additional databases without justified requirements.

Record important decisions in docs/adr/.

## 4. One-command deployment

A clean installation must work after .env configuration with:

docker compose up -d --build

No manual commands inside containers are permitted for
normal first-time initialization.

Automatically:
1. Validate configuration.
2. Start PostgreSQL and infrastructure.
3. Wait for required health checks.
4. Run database migrations.
5. Perform idempotent initial setup.
6. Start API, Worker, MQTT, frontend, and proxy.
7. Expose health and readiness status.

Use a dedicated one-shot migration service.

Never automatically delete or reset existing data.

No hardcoded production passwords.
No insecure fallback secrets.
Missing mandatory configuration must fail clearly.

Keep .env.example complete and documented.
Never commit actual .env values.

## 5. Docker security

Apply least privilege to every service.

Where supported:
- Run as a non-root user.
- Set no-new-privileges:true.
- Drop unnecessary Linux capabilities.
- Prefer cap_drop: [ALL].
- Use read-only root filesystems.
- Explicitly mount required writable directories.
- Use tmpfs for temporary runtime files.
- Apply memory, CPU, and PID limits.
- Keep default seccomp protection enabled.
- Disable privileged mode.
- Avoid host networking and host namespaces.
- Use isolated networks and named volumes.

Only publish ports that are required externally.

Do not expose databases or internal management APIs.

Do not mount Docker socket into application services.

Document and test justified exceptions.

Security hardening must not silently break functionality.

## 6. Authentication and tenant isolation

- Enforce authorization on every sensitive API.
- Implement server-side RBAC.
- Use secure password hashing and session handling.
- Support MFA for privileged users.
- Apply rate limits to authentication endpoints.
- Audit sensitive actions.
- Use least-privilege database accounts.
- Use MQTT authentication and topic-level ACL.
- Use unique device identities.
- Never use MAC addresses as the sole identity proof.
- Prevent cross-school data access.

## 7. Database and persistence

- Use PostgreSQL and Alembic migrations.
- Preserve existing data.
- Use foreign keys and appropriate constraints.
- Index school ownership and telemetry timestamps.
- Store UTC timestamps using timezone-aware types.
- Keep device identity separate from telemetry history.
- Never perform destructive migrations automatically.
- Validate migration compatibility before deployment.

Container recreation must preserve all persistent data.

## 8. Logging and monitoring

Custom services must emit structured JSON logs.

Requirements:
- stdout/stderr logging
- Configurable log levels
- Correlation/request IDs
- Docker log rotation
- Health/readiness checks
- No secrets in logs
- Security audit events
- Backup failure monitoring
- Device and Gateway connectivity status

Expose administrative monitoring only through
properly protected interfaces.

## 9. Dependencies and vulnerability management

Use actively maintained, supported dependencies.

- Pin production dependencies.
- Pin reviewed container image versions/digests.
- Prefer minimal multi-stage container images.
- Generate SBOMs for releases.
- Scan dependencies, source, secrets, and images.
- Add GitHub Actions security checks.
- Configure Dependabot or Renovate.
- Review dependency updates through PRs.
- Never blindly upgrade without testing.
- Never suppress findings to make CI green.

Block releases for relevant critical/high vulnerabilities
unless a documented assessment and human approval
authorize a narrowly scoped exception.

Do not claim the absence of all CVEs.

## 10. Backups, updates and recovery

Provide:
- Scheduled backups
- Configurable retention
- Encrypted off-host backup support
- Backup integrity verification
- Periodic restore testing
- Backup failure alerts
- Documented recovery procedures
- Versioned deployment and rollback instructions

Never delete the last valid recovery point.

Never test destructive restore operations on production.

Production backup destinations require explicit authorization.

Updates must preserve persistent data and support
safe, version-aware database migration procedures.

Do not auto-deploy unreviewed code to production.

## 11. IoT and safety

- Devices must have unique identities.
- Provisioning must verify device possession.
- Commands must be authenticated and authorized.
- Use command IDs, expiration and acknowledgments.
- Reject stale or replayed commands.
- Support offline Gateway behavior.
- Validate configuration before applying it.
- Provide signed OTA and recovery where supported.
- Never reboot safety devices automatically during alerts.
- Keep emergency audio above music in priority.
- Represent unknown alert state explicitly.
- Do not invent evacuation routes.

Safety-sensitive changes require human review,
simulation, and appropriate hardware testing.

## 12. Engineering process

Before editing:
1. Inspect existing code.
2. Read AGENTS.md and relevant docs.
3. Determine affected modules.
4. Identify security and migration risks.
5. Prepare a focused implementation plan.

During implementation:
- Prefer minimal coherent changes.
- Preserve working functionality.
- Use typed contracts and validation.
- Avoid duplicate configuration logic.
- Add tests for behavioral changes.
- Never hide exceptions or failing checks.

After implementation:
- Run relevant tests.
- Verify database migrations.
- Verify tenant isolation.
- Validate Docker Compose.
- Run applicable security scans.
- Update documentation.
- Report untested behavior.

Never invent test results.

## 13. Git rules

- Use a dedicated branch for each phase.
- Do not push directly to main.
- Do not force-push without approval.
- Do not delete unrelated user changes.
- Do not merge without review.
- Do not modify production resources.

## 14. Required delivery report

Every task must include:

1. Summary of changes
2. Files changed
3. Commands executed
4. Tests and actual results
5. Security scan results
6. Database migration impact
7. Persistent data impact
8. Known limitations
9. Manual verification procedure
10. Rollback procedure

## 15. Priority order

Host safety >
Human safety >
Security >
Tenant isolation >
Data integrity >
Reliability >
Correctness >
Maintainability >
Performance >
Visual polish
