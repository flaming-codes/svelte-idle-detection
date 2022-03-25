<script lang="ts" context="module">
  export const prerender = true;
</script>

<script lang="ts">
  import { onDestroy } from "svelte";

  import { idleDetectionStore } from "svelte-idle-detection";

  const {
    state,
    userState,
    screenState,
    requestPermission,
    requestPermissionAndStart,
    start,
    stop
  } = idleDetectionStore;

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
