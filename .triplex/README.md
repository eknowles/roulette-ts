# Triplex Configuration

This directory contains the Triplex configuration for the roulette game.

## Setup

Triplex is a development tool for building 3D scenes. The providers configured here will be used when working with Triplex.

## Providers

### GlobalProvider

- Sets up the root container with dark background
- Configurable `backgroundColor` prop

### CanvasProvider

- Wraps the 3D scene with Viverse
- Sets up lighting (ambient and spot lights)
- Configurable props:
  - `physicsEnabled`: Enable/disable physics (default: false)
  - `shadowsEnabled`: Enable/disable shadows (default: true)
  - `ambientIntensity`: Ambient light intensity (default: 0.2)
  - `spotLightIntensity`: Spot light intensity (default: 2)

## Usage

When using Triplex, these providers will automatically wrap your components. The props are available as controls in the Triplex scene panel.

## Integration with Existing App

The existing `RouletteApp` component can optionally use these providers, but they're primarily designed for use within Triplex's development environment.
