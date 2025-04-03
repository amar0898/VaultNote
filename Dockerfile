{\rtf1\ansi\ansicpg1252\cocoartf2758
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 FROM maven:3.8.4-openjdk-11 AS build\
WORKDIR /app\
COPY pom.xml .\
COPY src ./src\
RUN mvn clean package -DskipTests\
\
FROM openjdk:11-jre-slim\
COPY --from=build /app/target/VaultNote-0.0.1-SNAPSHOT.jar app.jar\
ENTRYPOINT ["java", "-jar", "app.jar"]}