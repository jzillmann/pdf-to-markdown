<script>
    import Dropzone from 'svelte-file-dropzone';
    import { Download } from 'svelte-hero-icons';
    import { processUpload, loadExample } from './store';

    let specifiedFileName: string;
    let dragover = false;
    let upload: Promise<any>;
    let rejectionError: string;

    function handleExampleLoad() {
        rejectionError = undefined;
        specifiedFileName = 'ExamplePdf.pdf';
        upload = loadExample();
    }
    function handleFilesSelect(e) {
        rejectionError = undefined;
        const { acceptedFiles, fileRejections } = e.detail;
        if (acceptedFiles.length === 1) {
            const specifiedFile = acceptedFiles[0];
            specifiedFileName = specifiedFile.name;
            upload = processUpload(specifiedFile);
        }
        if (fileRejections.length > 1) {
            const fileNames = fileRejections.map((r) => r.file.name);
            rejectionError = `Only one file at a time allowed! Rejected ${fileRejections.length} files: '${fileNames}'.`;
        }
    }
</script>

<!-- Options -->
<div class="mb-0.5 flex flex-row-reverse space-x-2 space-x-reverse text-sm items-center">
    <div class="py-0.5 border-2 border-gray-50 hover:underline cursor-pointer" on:click={handleExampleLoad}>
        Load Example
    </div>
    <div class="py-0.5 px-1 border-2 border-gray-50 hover:border-blue-600 cursor-pointer">Debug</div>
</div>

<!-- Upload Box -->
<div class="pb-5 border-2 border-dashed border-gray-400 hover:border-blue-800" class:dragover>
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
            <div class="px-5">
                <div class="text-5xl font-bold my-4">Drop your PDF file here...</div>
                <div class="text-2xl font-bold">Or click the box to select one...</div>
                <div class="mt-14"><strong>Note:</strong> Your data stays locally in your browser.</div>
                <div class="mt-5 text-sm italic font-serif">
                    This tool converts a PDF file into a Markdown text format! Simply drag & drop your PDF file on the
                    upload area and go from there. Don't expect wonders, there are a lot of variances in generated PDF's
                    from different tools and different ages. No matter how good the parser works for your PDF, you will
                    have to invest a good amount of manuell work to complete it.
                </div>
            </div>
        </div>
    </Dropzone>
</div>

<div class="mt-5 text-center font-bold">
    {#await upload}
        <div>Parsing {specifiedFileName}...</div>
    {:catch error}
        <div class="text-red-700">Failed to parse '{specifiedFileName}': {error.message}</div>
    {/await}
    {#if rejectionError}
        <div class="text-red-700">{rejectionError}</div>
    {/if}
</div>

<style>
    .dragover {
        @apply border-purple-600;
    }
    .dragoverItem {
        @apply text-purple-600;
    }
</style>
