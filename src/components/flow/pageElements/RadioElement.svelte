<script lang="ts">
  import { Card, Heading, P, Listgroup, type ListGroupItemType, Spinner } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";
  import { onMount } from "svelte";
  import { transformLookup } from "../../../utils/FormParser";
  import { form } from "../../../stores/appStore";

  export let element: IElement;

  let isTransforming = false;
  let options = element.Properties?.Options?.map((option) => {
    const listItem: ListGroupItemType = {
      name: option.Value,
      conditionalElement: option.ConditionalElementId,
      hint: option.Hint,
    };

    return listItem;
  });

  form.subscribe(() => {
    options = element.Properties?.Options?.map((option) => {
      const listItem: ListGroupItemType = {
        name: option.Value,
        conditionalElement: option.ConditionalElementId,
        hint: option.Hint,
      };

      return listItem;
    });
  });

  onMount(async () => {
    if (element.Lookup) {
      isTransforming = true;
      element = await transformLookup(element);
      options = element.Properties?.Options?.map((option) => {
        const listItem: ListGroupItemType = {
          name: option.Value,
          conditionalElement: option.ConditionalElementId,
          hint: option.Hint,
        };

        return listItem;
      });
      isTransforming = false;
    }
  });
</script>

<div>
  {#if isTransforming}
    <Spinner />
  {:else if element.Properties && element.Properties.Options}
    <Listgroup items={options} let:item class="my-2">
      <div>
        <span class="font-semibold text-black">{item.name}</span> <span class="font-bold text-orange-400">{item.conditionalElement || ""}</span>
      </div>
      {#if item.hint}
        {item.hint}
      {/if}
    </Listgroup>
  {/if}
</div>

<style>
</style>
