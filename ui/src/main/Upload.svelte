<script>
    import { blur, slide } from 'svelte/transition';
    import Dropzone from 'svelte-file-dropzone';
    import { Download, Check } from 'svelte-hero-icons';
    import { processUpload, loadExample, loadUrl } from '../store';
    import type Progress from '@core/Progress';
    import ProgressRing from '../components/ProgressRing.svelte';
    import Checkbox from '../components/Checkbox.svelte';
    import { debugEnabled } from '../config';

    let specifiedFileName: string;
    let dragover = false;
    let upload: Promise<any>;
    let rejectionError: string;
    let parseProgress: Progress;
    function handleUrlLoad() {
        dragover = true;
        var answer = prompt('Url of the pdf');
        specifiedFileName = answer;
        rejectionError = undefined;
        parseProgress = undefined;
        upload = loadUrl(handleProgress, answer);
    }

    function handleExampleLoad() {
        dragover = true;
        specifiedFileName = 'ExamplePdf.pdf';
        rejectionError = undefined;
        parseProgress = undefined;
        upload = loadExample(handleProgress);
    }

    function handleFilesSelect(e) {
        specifiedFileName = undefined;
        rejectionError = undefined;
        parseProgress = undefined;
        const { acceptedFiles, fileRejections } = e.detail;
        if (acceptedFiles.length === 1) {
            const specifiedFile = acceptedFiles[0];
            specifiedFileName = specifiedFile.name;
            upload = processUpload(specifiedFile, handleProgress);
        }
        if (fileRejections.length > 1) {
            const fileNames = fileRejections.map((r) => r.file.name);
            rejectionError = `Only one file at a time allowed! Rejected ${fileRejections.length} files: '${fileNames}'.`;
        }
    }

    function handleProgress(progress: Progress) {
        parseProgress = progress;
    }
</script>

<div class="container mx-auto">
    <!-- Options -->
    <div class="mb-0.5 flex flex-row-reverse space-x-2 space-x-reverse text-sm items-center">
        <div class="py-0.5 border-2 border-gray-50 hover:underline cursor-pointer" on:click={handleExampleLoad}>
            Load Example
        </div>
        <div class="py-0.5 border-2 border-gray-50 hover:underline cursor-pointer" on:click={handleUrlLoad}>
            Open Url
        </div>
        <Checkbox name="Debug" bind:enabled={$debugEnabled} />
    </div>

    <!-- Upload Box -->
    <div class="mb-5 border-2 border-dashed border-gray-400 hover:border-select" class:dragover>
        <Dropzone
            on:drop={handleFilesSelect}
            on:dragenter={() => (dragover = true)}
            on:dragleave={() => (dragover = false)}
            multiple={false}
            noClick={false}
            disableDefaultStyles={true}>
            <div class="grid grid-cols-1 md:grid-cols-2 justify-items-center">
                <span class:dragoverItem={dragover}>
                    <Download size="21x" />
                </span>
                <div class="px-5 mb-5">
                    <div class="text-5xl font-bold my-4">Drop your PDF file here...</div>
                    <div class="text-2xl font-bold">Or click the box to select one...</div>
                    <div class="mt-14"><strong>Note:</strong> Your data stays locally in your browser.</div>
                    <div class="mt-5 text-sm italic font-serif">
                        This tool converts a PDF file into a Markdown text format! Simply drag & drop your PDF file on
                        the upload area and go from there. Don't expect wonders, there are a lot of variances in
                        generated PDF's from different tools and different ages. No matter how good the parser works for
                        your PDF, you will have to invest a good amount of manuell work to complete it.
                    </div>
                </div>
            </div>
        </Dropzone>
    </div>

    <!-- Progress Info -->
    <div class="mt-5 text-xl font-bold">
        <div style="min-width: 70%;">
            {#if specifiedFileName}
                <div in:blur class="text-2xl mb-2">Parsing {specifiedFileName} ...</div>
            {/if}
            {#if parseProgress}
                <div in:blur class="flex space-x-4">
                    <ProgressRing radius={50} stroke={7} progress={parseProgress?.totalProgress() * 100} />
                    <div>
                        {#each parseProgress.stages as stage, index}
                            {#if parseProgress.isProgressing(index)}
                                <div class="flex space-x-2 items-center">
                                    <div>
                                        Parsing
                                        {stage}
                                        {parseProgress.stageDetails[index] ? parseProgress.stageDetails[index] : ''}
                                    </div>
                                </div>
                            {:else if parseProgress.isComplete(index)}
                                <div class="flex space-x-2 items-center ">
                                    <div>
                                        Parsing
                                        {stage}
                                        {parseProgress.stageDetails[index] ? parseProgress.stageDetails[index] : ''}
                                    </div>
                                    <Check size="1.5x" class="text-select" />
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/if}
            {#if rejectionError}
                <div in:slide class="text-red-700">{rejectionError}</div>
            {/if}
            {#await upload}
                <!--  -->
            {:catch error}
                <div class="text-red-700">Failed to parse '{specifiedFileName}': {error?.message}</div>
            {/await}
        </div>
    </div>
</div>

<style>
    .dragover {
        @apply border-select;
    }
    .dragoverItem {
        @apply text-select;
    }
</style>
