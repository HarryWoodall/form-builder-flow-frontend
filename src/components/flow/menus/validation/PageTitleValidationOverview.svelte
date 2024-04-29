<script lang="ts">
  import { Heading, P, Button, Drawer, A } from "flowbite-svelte";
  import { form, pageTitleValidation } from "../../../../stores/appStore";
  import type { PageTitleValidationResult } from "../../../../models/Validation";
  import type { FormSchema } from "../../../../models/FormSchema";

  let invalidPages: PageTitleValidationResult[] | undefined = $pageTitleValidation.filter((v) => !v.isValid).sort((a, b) => a.pageIndex - b.pageIndex);
  let currentForm: FormSchema | undefined = $form;

  pageTitleValidation.subscribe((validation) => {
    invalidPages = validation.filter((v) => !v.isValid).sort((a, b) => a.pageIndex - b.pageIndex);
  });

  form.subscribe((form) => {
    currentForm = form;
  });
</script>

<div>
  {#if invalidPages != undefined && invalidPages.length && currentForm != undefined && currentForm.Pages != undefined}
    <hr class="h-px my-8 pr-3 bg-gray-200 border-0 dark:bg-gray-700" />
    <div class="flex mt-8 mb-4 justify-between align-middle">
      <Heading tag="h2" class="font-bold text-white w-fit" customSize="text-xl">Page titles</Heading>
    </div>
    <div>
      {#each invalidPages as validation}
        <div class="bg-amber-700 p-2 my-1 rounded">
          <Heading tag="h3" class="font-bold pr-3 text-white underline" customSize="text-xl">{currentForm?.Pages[validation.pageIndex].Title}</Heading>
          <P class="text-white"
            ><span class="font-bold text-amber-200">{validation.missmatchData?.elementLabel}</span> is not equal to page title
            <span class="font-bold text-amber-200">{validation.missmatchData?.pageTitle}</span></P
          >
        </div>
      {/each}
    </div>
  {/if}
</div>
