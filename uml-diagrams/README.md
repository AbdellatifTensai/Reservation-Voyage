# TrainEase UML Diagrams

This directory contains UML diagrams for the TrainEase Train Ticket Reservation System. These diagrams illustrate the system architecture, components, relationships, and behavior.

## Diagrams Overview

### 1. Use Case Diagram (`use-case-diagram.puml` and `.txt`)

The Use Case diagram illustrates the different ways users interact with the TrainEase system. It shows:

- The two main actors: Regular Users and Administrators
- Authentication use cases (login, register, logout)
- Regular user operations (viewing trains, booking tickets, etc.)
- Administrative operations (managing users, trains, and routes)
- The relationships and dependencies between these use cases

### 2. Class Diagram (`class-diagram.puml` and `.txt`)

The Class diagram depicts the system's structure by showing:

- The Java backend classes and their relationships
- Packages including:
  - `com.trainease.entity`: Data entities (User, Train, Route, Booking)
  - `com.trainease.dto`: Data Transfer Objects
  - `com.trainease.service`: Service interfaces
  - `com.trainease.service.impl`: Service implementations
  - `com.trainease.controller`: Controller classes
  - `com.trainease.server`: Server components
  - `com.trainease.config`: Configuration classes
- Relationships between classes (associations, dependencies, etc.)
- Methods and properties of each class

### 3. Frontend Component Diagram (`frontend-component-diagram.puml` and `.txt`)

This diagram shows the React frontend structure, including:

- Main components (App, Router, Providers)
- Page components (dashboards, forms, etc.)
- UI components (buttons, forms, cards, etc.)
- Hooks and utilities (useAuth, useForm, etc.)
- The relationships and dependencies between components

### 4. Sequence Diagram for MVC Pattern (`sequence-diagram.puml` and `.txt`)

The Sequence diagram demonstrates the Model-View-Controller pattern in action by showing:

- The step-by-step process of booking a train ticket
- How user actions in the View trigger events
- How Controllers process these events
- How the Model interacts with the database
- How data flows through the system
- The interactions between components over time

### 5. Admin Sequence Diagram (`admin-sequence-diagram.txt`)

This sequence diagram illustrates the administrator workflows, including:

- Admin authentication process
- Managing routes (add, edit, delete operations)
- Managing trains (similar operations)
- Managing users (viewing, toggling admin status, deletion)
- How admin actions flow through the system
- Communication between frontend, controllers, and database

## Using the Diagrams

These PlantUML diagrams can be rendered using:

1. PlantUML extension in VS Code or other IDEs
2. Online PlantUML servers
3. PlantUML command-line tools

The diagrams serve as documentation of the system architecture and can be used for:

- Understanding the system structure
- Onboarding new developers
- Planning system modifications
- Communicating with stakeholders
