# ============================================================
#   Resume Builder — Backend Dockerfile
#   Multi-stage build:
#     Stage 1 (builder) → compiles the Java app with Maven
#     Stage 2 (runtime) → runs only the JAR, no build tools
# ============================================================

# ── Stage 1: Build ──────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom.xml first (layer caching)
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

# Fix execute permission on mvnw (required when committed from Windows)
RUN chmod +x mvnw

# Download dependencies only (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy source code and build the JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# ── Stage 2: Runtime ────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app

# Create a non-root user for security best practice
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Give ownership to the non-root user
RUN chown appuser:appgroup app.jar
USER appuser

# Expose Spring Boot port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]