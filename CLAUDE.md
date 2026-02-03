# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@flashist/appframework is a TypeScript application framework for building interactive 2D applications using Pixi.js for rendering. It provides a modular, command-driven architecture with dependency injection, centralized state management, and an Entity-Component-System (ECS) engine.

## Build Commands

```bash
npm run build          # Build with Gulp (compiles TypeScript to /dist)
npm run publish:patch  # Bump patch version, build, and publish to npm
npm run publish:minor  # Bump minor version, build, and publish to npm
npm run publish:major  # Bump major version, build, and publish to npm
```

No test framework is configured in this repository.

## Architecture

### Entry Point and Initialization

The `Facade` class (`src/facade/Facade.ts`) is the main entry point. Applications start via `Facade.init(options)` which:
1. Initializes the ServiceLocator for dependency injection
2. Registers and activates all modules in sequence
3. Executes `InitApplicationCommand` which orchestrates the startup (load configs, parse assets, initialize views)

### Module System

Features are organized as modules extending `BaseAppModule`. Each module has lifecycle hooks:
- `init()` - Register services with ServiceLocator
- `preInitHook()` - Run before all modules initialize
- `postInitHook()` - Run after all modules initialize
- `postCompleteHook()` - Run after full activation

Core modules loaded by default: GlobalEventDispatcher, AppState, App, ObjectsPool, Device, Renderer, LocalStorage, Load, Sounds, HTML, Locales, Pages, Time, Containers (and Debug in debug mode).

### Key Patterns

**Dependency Injection**: Uses `@flashist/flibs` ServiceLocator
```typescript
serviceLocatorAdd(MyClass, { isSingleton: true, forceCreation: true });
getInstance(MyClass);
```

**Global Event Dispatcher**: All events bubble up to a global dispatcher for cross-module communication
```typescript
getInstance(GlobalEventDispatcher).dispatchEvent(eventType, ...args);
```

**State Management**: Centralized reactive state with deep key path updates
```typescript
appStateStorage().change<AppState>()("user.profile.name", "John");
appStateStorage().getState<AppState>();
```

**Queue Commands**: Sequential command execution for complex flows
```typescript
new QueueCommand([cmd1, cmd2, cmd3]).execute();
```

**ECS**: Entity-Component-System for game logic in `src/ecs/`

### Directory Structure (src/)

- `facade/` - Main Facade entry point
- `base/` - Base classes (Commands, Managers, Views, Mediators, Models, Modules)
- `state/` - Centralized state management (AppStateStorage)
- `ecs/` - Entity-Component-System engine
- `pages/` - Page/scene navigation system
- `display/` - UI components (buttons, layouts, lists, view stacks)
- `renderer/` - Pixi.js renderer management
- `load/` - Resource loading (images, audio, data)
- `locales/` - Localization/i18n system
- `sounds/` - Audio management
- `windows/` - Modal window/dialog system

### External Dependencies

- `@flashist/fcore` - Core utilities (BaseObject, Command, EventDispatcher)
- `@flashist/flibs` - Library utilities (ServiceLocator, FApp, FContainer)
- `pixi.js` - 2D WebGL rendering
- `gsap` - Animation library

### Naming Conventions

- Commands: `*Command`
- Managers: `*Manager`
- Views: `*View`
- Models: `*Model`
- Events: `*Event` with `EVENT_NAME` constants
- Interfaces: `I*` prefix
- Value objects: `*VO` suffix
- State types: `*State` suffix
