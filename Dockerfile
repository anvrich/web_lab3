# --- build ---
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY . /app
RUN mvn -q -DskipTests package


# --- runtime ---
FROM quay.io/wildfly/wildfly:34.0.1.Final-jdk21
COPY --from=build /app/target/app.war $JBOSS_HOME/standalone/deployments/ROOT.war
EXPOSE 8080

