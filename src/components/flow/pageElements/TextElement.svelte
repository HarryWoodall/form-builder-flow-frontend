<script lang="ts">
  import { Card, Heading, P } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";

  export let element: IElement;
</script>

<div>
  <Heading tag="h2" customSize="font-bold">{element.Properties?.Text}</Heading>
  <P class="mb-1 text-gray-500">{element.Type}</P>
</div>

<style>
</style>
