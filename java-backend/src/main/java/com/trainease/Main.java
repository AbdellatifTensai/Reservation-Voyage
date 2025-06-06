package com.trainease;

import java.io.IOException;
import java.net.URI;
import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.glassfish.grizzly.http.server.HttpHandler;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ContainerFactory;
import org.glassfish.jersey.server.ResourceConfig;

public class Main {

    private static final String BASE_URI = "http://localhost:8081";

    public static HttpServer startServer() {
        HttpServer server = GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI));

        // Changed the API path prefix to /java-api to avoid conflicts with Node.js API
        final ResourceConfig config = new ResourceConfig().packages("com.trainease.controller")
                .register(JacksonFeature.class);

        server.getServerConfiguration().addHttpHandler(ContainerFactory.createContainer(HttpHandler.class,
                config),
                "/java-api");

        return server;
    }

    public static void main(String[] args) throws IOException {
        Logger grizzlyLogger = Logger.getLogger("");
        ConsoleHandler consoleHandler = new ConsoleHandler();
        consoleHandler.setLevel(Level.ALL);
        grizzlyLogger.addHandler(consoleHandler);
        grizzlyLogger.setLevel(Level.ALL);

        final HttpServer server = startServer();
        System.out.println("App started at " + BASE_URI + "\nPress Ctrl+C to stop...");

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\nStopping server...");
            server.shutdownNow();
            JpaUtil.close();
            System.out.println("Server stopped.");
        }));

        System.in.read();
        server.shutdownNow();
    }
}
