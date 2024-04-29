<script lang="ts">
  import { Heading, P } from "flowbite-svelte";
  import { spellingValidation as _spellingValidation, spellcheckFeature as _spellcheckFeature } from "../../../../stores/appStore";
  import type { Note } from "../../../../models/Notes";
  import type { PageSpellCheck, SpellCheckItemValidationResult } from "../../../../models/Validation";

  type NotePageData = {
    pageTitle: string;
    notes: Note[];
  };

  let spellingValidation: PageSpellCheck[] | undefined = $_spellingValidation;
  let spellcheckFeature = $_spellcheckFeature;

  _spellingValidation.subscribe((validation) => {
    spellingValidation = validation;
  });

  _spellcheckFeature.subscribe((feature) => {
    spellcheckFeature = feature;
  });

  const highlightString = (validationItem: SpellCheckItemValidationResult) => {
    let string = validationItem.fullString;
    for (let result of validationItem.spellCheckResult) {
      console.log(result.misspeltWord);
      string = string.replaceAll(result.misspeltWord, `<span class="font-bold text-yellow-300 italic">${result.misspeltWord}</span>`);
    }

    return string;
  };
</script>

<div>
  {#if spellcheckFeature && spellingValidation != undefined && spellingValidation.length}
    <hr class="h-px my-8 pr-3 bg-gray-200 border-0 dark:bg-gray-700" />
    <div class="flex mt-8 mb-4 justify-between align-middle">
      <Heading tag="h2" class="font-bold text-white w-fit" customSize="text-xl">Spelling</Heading>
    </div>
    <div>
      {#each spellingValidation as validation}
        <div class="bg-amber-700 p-2 my-1 rounded">
          <Heading tag="h3" class="font-bold pr-3 text-white" customSize="text-lg">{validation.page}</Heading>
          {#each validation.result as validationItem}
            <div class="my-6">
              <div class="flex items-baseline my-1">
                {#if validationItem.questionId != undefined}
                  <P class="text-white text-sm font-semibold">{validationItem.questionId}></P>
                {/if}
                <P class="text-amber-200 italics text-sm">{validationItem.type}</P>
              </div>
              <P class="text-amber-100 italics text-xl">{@html highlightString(validationItem)}</P>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>
