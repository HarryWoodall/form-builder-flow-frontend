<script lang="ts">
  import { Heading, P, Button, Drawer, A } from "flowbite-svelte";
  import { form, backButtonValidation as _backButtonValidation } from "../../../../stores/appStore";
  import type { Note } from "../../../../models/Notes";
  import type { FormSchema } from "../../../../models/FormSchema";
  import type { PageSpellCheck, SpellCheckItemValidationResult, BackButtonValidationResult } from "../../../../models/Validation";

  type NotePageData = {
    pageTitle: string;
    notes: Note[];
  };

  let backButtonValidation: BackButtonValidationResult[] | undefined = $_backButtonValidation.filter((v) => !v.isValid);
  let currentForm: FormSchema | undefined = $form;

  _backButtonValidation.subscribe((validation) => {
    backButtonValidation = validation.filter((v) => !v.isValid);
  });

  form.subscribe((form) => {
    currentForm = form;
  });

  const highlightString = (validationItem: SpellCheckItemValidationResult) => {
    let string = validationItem.fullString;
    for (let result of validationItem.spellCheckResult) {
      console.log(result.misspeltWord);
      string = string.replaceAll(result.misspeltWord, `<span class="font-bold text-yellow-300 italic">${result.misspeltWord}</span>`);
    }

    console.log(string);

    return string;
  };
</script>

<div>
  {#if backButtonValidation != undefined && backButtonValidation.length && currentForm != undefined && currentForm.Pages != undefined}
    <hr class="h-px my-8 pr-3 bg-gray-200 border-0 dark:bg-gray-700" />
    <div class="flex mt-8 mb-4 justify-between align-middle">
      <Heading tag="h2" class="font-bold text-white w-fit" customSize="text-xl">Back Buttons</Heading>
    </div>
    <div>
      {#each backButtonValidation as validation}
        <div class="bg-amber-700 p-2 my-1 rounded">
          <P class="pr-3 text-white text-lg"
            ><span class="font-bold">{currentForm?.Pages[validation.pageIndex].Title}</span> has a back button
            <span class="font-bold text-amber-300">{validation.errorType?.toLowerCase()}</span></P
          >
        </div>
      {/each}
    </div>
  {/if}
</div>
