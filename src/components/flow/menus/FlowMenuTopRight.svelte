<script lang="ts">
  import { slide } from "svelte/transition";
  import {
    currentModalOpen,
    form as _form,
    formFlowValidation,
    pageTitleValidation as _pageTitleValidation,
    backButtonValidation as _backButtonValidation,
  } from "../../../stores/appStore";
  import FlowValidationAlert from "./FlowValidationDraw.svelte";
  import FormDetails from "./FormDetails.svelte";

  const openModal = (name: string) => {
    console.log("opening", name);
    currentModalOpen.update(() => name);
  };

  let pageTitleValidation = $_pageTitleValidation;
  let backButtonValidation = $_backButtonValidation;
  let form = $_form;
  let isFormValid = false;

  const validateForm = () => {
    console.log(pageTitleValidation);
    isFormValid =
      ($formFlowValidation == undefined || ($formFlowValidation?.invalidPageSlugs.length == 0 && $formFlowValidation?.unreachablePages.length == 0)) &&
      pageTitleValidation.filter((v) => !v.isValid).length == 0 &&
      backButtonValidation.filter((v) => !v.isValid).length == 0;
  };

  _form.subscribe((formData) => {
    form = formData;
    validateForm();
  });

  _backButtonValidation.subscribe((validation) => {
    backButtonValidation = validation;
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
