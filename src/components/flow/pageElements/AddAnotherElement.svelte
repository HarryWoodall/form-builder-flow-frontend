<script lang="ts">
  import type { IElement } from "../../../models/FormSchema";
  import BaseElement from "./BaseElement.svelte";

  export let element: IElement;
  export let index: number;
  export let pageName: string | undefined | null;
  export let type: string;
</script>

<BaseElement {element} {index} {pageName} {type} isAddAnother={true} />

<style>
</style>
