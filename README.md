# Svelte Idle Detection API

This library provides a readable Svelte store to use a PWA's access to the [`Idle Detection API`](https://developer.mozilla.org/en-US/docs/Web/API/Idle_Detection_API), available on the window. It allows you to read certain state-values, defined by the API. As this API requires user permission, relevant helper functions are also included

> Note: This feature is currently experimental and only supported in a subset of Chromium-browsers.

This package is part of a collection of PWA-related svelte-packages:

- [🖥️ Screen Wake Lock](https://www.npmjs.com/package/svelte-screen-wake-lock)
- [🔋 Battery Status](https://www.npmjs.com/package/svelte-battery-status)
- [📡 Network Information](https://www.npmjs.com/package/svelte-network-information)
- [🦥 Idle Detection API](https://www.npmjs.com/package/svelte-idle-detection)

## Install

```text
npm i -D svelte-idle-detection
```

## Usage

### Basic

The following example shows a simple, complete usage of the `idleDetectionStore`. It reads the store's `state` as well as `userState` and `screenState`, which come from the API. All possible helper functions are implemented to show a common use case for this library.

```svelte
<script lang="ts">
  import { idleDetectionStore as store } from "svelte-idle-detection";

  const {
    state,
    userState,
    screenState,
    requestPermission,
    requestPermissionAndStart,
    start,
    stop
  } = store;

  // Unsubscribe if the component unmounts.
  onDestroy(stop);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<ul>
  <li>State: {$state}</li>
  <li>UserState: {$userState}</li>
  <li>ScreenState: {$screenState}</li>
</ul>

{#if $state === "init"}
  <button on:click={requestPermission}>Check permission</button>
  <button on:click={() => requestPermissionAndStart()}>Check permission & start</button>
{/if}

{#if $state === "not-permitted"}
  <span>Not permitted</span>
{/if}

{#if $state === "ready" || $state === "stopped"}
  <button on:click={() => start()}>Start</button>
{/if}

{#if $state === "started"}
  <button on:click={stop}>Stop</button>
{/if}

```

### Derived

To subscribe to changes for only a specific selection of values, simply create a `derived` store.

```svelte
<script lang="ts">
  import { idleDetectionStore } from 'svelte-battery-status';
  import { derived } from 'svelte/store';

  const state = derived(idleDetectionStore, ($store) => $store.state);
</script>

state: {$state}
```

## API

                                                                                                                                                                    |

## Svelte Development Help

- [MSW w/ SvelteKit for local development](https://flaming.codes/posts/msw-in-sveltekit-for-local-development)
- [License generator for SvelteKit-projects](https://flaming.codes/posts/license-generator-for-dependencies-in-sveltekit)
- [Lazy-loading modules in SvelteKit](https://flaming.codes/posts/lazy-loading-modules-in-svelte-to-import-components-on-demand)
- [Custom $lib-folder in SvelteKit](https://flaming.codes/posts/custom-lib-folder-with-path-alias-in-sveltekit))
- [HMR for SvelteKit w/ Gitpod](https://flaming.codes/posts/setup-hmr-for-sveltekit-with-gitpod)
