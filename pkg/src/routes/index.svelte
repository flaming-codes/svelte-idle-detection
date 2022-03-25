<script lang="ts">
  import { idleDetectionStore as store } from "$lib";

  const { state, userState, screenState, requestPermission } = store;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<ul>
  <li>State: {$state}</li>
  <li>UserState: {$userState}</li>
  <li>ScreenState: {$screenState}</li>
</ul>

<button on:click={requestPermission}>Permission</button>
