<script lang="ts">
  import { slide } from "svelte/transition";
</script>

<div class="menu-background-container absolute top-0 left-0 w-full h-24 z-1 box-border p-3">
  <div class="bg-white w-full h-full rounded-lg border-gray-300 border-2 box-border shadow-md"></div>
</div>

<style>
  .menu-background-container {
    top: -4px;
    z-index: 5;
  }
</style>
