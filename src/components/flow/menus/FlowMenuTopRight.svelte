<script lang="ts">
  import { slide } from "svelte/transition";
  import {
    currentModalOpen,
    form as _form,
    formFlowValidation,
    pageTitleValidation as _pageTitleValidation,
    spellingValidation as _spellingValidation,
    backButtonValidation as _backButtonValidation,
    spellcheckFeature as _spellcheckFeature,
  } from "../../../stores/appStore";
  import FlowValidationAlert from "./FlowValidationDraw.svelte";
  import FormDetails from "./FormDetails.svelte";

  const openModal = (name: string) => {
    console.log("opening", name);
    currentModalOpen.update(() => name);
  };

  let spellingValidation = $_spellingValidation;
  let pageTitleValidation = $_pageTitleValidation;
  let backButtonValidation = $_backButtonValidation;
  let spellcheckFeature = $_spellcheckFeature;
  let form = $_form;
  let isFormValid = false;

  const validateForm = () => {
    console.log(pageTitleValidation);
    isFormValid =
      ($formFlowValidation == undefined || ($formFlowValidation?.invalidPageSlugs.length == 0 && $formFlowValidation?.unreachablePages.length == 0)) &&
      pageTitleValidation.filter((v) => !v.isValid).length == 0 &&
      backButtonValidation.filter((v) => !v.isValid).length == 0;

    if (spellcheckFeature) {
      isFormValid = isFormValid && spellingValidation.filter((v) => v.result.length).length == 0;
    }
  };

  _form.subscribe((formData) => {
    form = formData;
    validateForm();
  });

  _spellingValidation.subscribe((validation) => {
    if (spellcheckFeature) {
      spellingValidation = validation;
      validateForm();
    }
  });

  _backButtonValidation.subscribe((validation) => {
    backButtonValidation = validation;
    validateForm();
  });

  _spellcheckFeature.subscribe((spellCheckAvailable) => {
    spellcheckFeature = spellCheckAvailable;
    validateForm();
  });

  validateForm();
</script>

<div class="flex mt-2 items-center mr-3">
  {#if form}
    {#if !isFormValid}
      <FlowValidationAlert />
    {/if}

    <FormDetails />
  {/if}
</div>
