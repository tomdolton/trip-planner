# E2E Testing with Playwright

This directory contains end-to-end tests for the Trip Planner application using Playwright.

## Setup

The following files have been configured:

### Configuration Files

- `playwright.config.ts` - Main Playwright configuration
- `test.config.ts` - Additional test configuration
- `global-setup.ts` - Global setup that runs before all tests
- `global-teardown.ts` - Global cleanup that runs after all tests

### Test Files

- `example.spec.ts` - Homepage tests
- `trips.spec.ts` - Trips page functionality tests
- `auth.spec.ts` - Authentication flow tests
- `navigation.spec.ts` - Navigation and layout tests
- `workflows.spec.ts` - Complex user workflow tests

### Helper Files

- `helpers.ts` - Common test utilities and mock functions

## Running Tests

Use the following npm scripts to run tests:

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step by step
npm run test:e2e:debug
```

## Test Structure

### Basic Tests

- Homepage functionality
- Navigation between pages
- Filter tab switching
- Responsive design

### Authentication Tests

- Login/signup page accessibility
- Navigation between auth pages
- Authenticated vs unauthenticated states

### Workflow Tests

- Complete user journeys
- Error handling
- State persistence
- API failure scenarios

## Writing New Tests

1. Create new `.spec.ts` files in the `tests/` directory
2. Use the `TripPlannerTestHelpers` class for common operations
3. Follow the existing test patterns for consistency
4. Use descriptive test names and organize with `test.describe()`

## Features Configured

- ✅ Automatic dev server startup
- ✅ Multiple browser testing (Chrome, Firefox, Safari)
- ✅ Screenshots on failure
- ✅ Video recording on failure
- ✅ Trace collection for debugging
- ✅ HTML test reports
- ✅ CI/CD integration with GitHub Actions

## Tips

- Tests run against `http://localhost:3000` by default
- The dev server starts automatically when running tests
- Use `page.pause()` in tests to debug interactively
- Check the `playwright-report/` folder for detailed test results
