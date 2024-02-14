<script lang="ts">
  import { Heading, P, Button, Drawer, A } from "flowbite-svelte";
  import { detailsPanelVisible, form as Form } from "../../../stores/appStore";
  import type { FormSchema } from "../../../models/FormSchema";

  let form: FormSchema | undefined = $Form!;

  Form.subscribe((value) => {
    form = value;
  });

  const handleOpen = () => {
    detailsPanelVisible.update(() => true);
  };
</script>

<Button
  class="bg-transparent text-black text-md font-semibold hover:bg-green-500 hover:bg-transparent hover:underline max-w-[500px] whitespace-nowrap"
  on:click={handleOpen}
>
  <span class="overflow-ellipsis overflow-hidden">{form.FormName}</span>
</Button>
