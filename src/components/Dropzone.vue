<template>
<div id="wrapper">
      <div class="dropzone-area" @dragenter="hovering = true" @dragleave="hovering = false" :class="{hovered: hovering}">
          <div class="dropzone-text">
              <span class="dropzone-title">Drop image here or click to select</span>
          </div>
          <input type="file" @change="onFileChange">
      </div>
  <div class="dropzone-preview">
      <img :src="image" />
      <button @click="removeImage" v-if="image">Remove</button>
  </div>
  </div>
</template>

<script>
import store from '../store.js'
import pdfjs from 'pdfjs-dist';
import Page from '../models/Page.js';
import TextItem from '../models/TextItem.js';

export default {
    props : {
            multiple : {
                default : false
            },
            path : {
                default : '/document/upload-unlinked/'
            },
            file : {
                default : 'user_file'
            },
            files : {
                default : function () { return [] }
            },
            target : {
                default : 'dropzone'
            },
            clickable : {
                default : false
            },
            previewTemplate : {
                default : '<div style="display:none"></div>'
            },
            createImageThumbnails : {
                default : false
            }
    },
    data() {
        return {
            hovering : false,
            image: null,
        }
    },
    computed: {
        multipleUploads() {
            return this.multiple ? true : false;
        }
    },
    methods: {
      onFileChange(e) {
          console.debug('upload');
          var files = e.target.files || e.dataTransfer.files;
          console.debug(files);
          if (!files.length) return;

          const reader = new FileReader();
          reader.onload = (evt) => {
            console.debug("Loaded");
            const buffer = evt.target.result;
            PDFJS.getDocument(buffer).then(function (pdfDocument) {
              console.log('Number of pages: ' + pdfDocument.numPages);
              // console.debug(pdfDocument);
              const numPages = pdfDocument.numPages;
              // const numPages = 3;
              store.preparePageUpload(numPages);
              for (var i = 0; i <= numPages; i++) {
                pdfDocument.getPage(i).then(function(page){
                  page.getTextContent().then(function(textContent) {
                          //console.debug(textContent);
                          const textItems = textContent.items.map(function(item) {
                            const transform = item.transform;
                            return new TextItem({
                              x: transform[4],
                              y: transform[5],
                              width: item.width,
                              height: item.height,
                              text: item.str
                            });
                          });
                          store.uploadPage(page.pageIndex, textItems);
                  });
                });
              }
            });
          };
          reader.readAsArrayBuffer(files[0]);
      },
      removeImage: function (e) {
          this.image = '';
      }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>
  .dropzone-area {
    width: 80%;
    height: 200px;
    position: relative;
    border: 2px dashed #CBCBCB;
    &.hovered {
        border: 2px dashed #2E94C4;
        .dropzone-title {
          color: #1975A0;
        }

    }
}

.dropzone-area input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.dropzone-text {
    position: absolute;
    top: 50%;
    text-align: center;
    transform: translate(0, -50%);
    width: 100%;
    span {
        display: block;
        font-family: Arial, Helvetica;
        line-height: 1.9;
    }
}

.dropzone-title {
    font-size: 13px;
    color: #787878;
    letter-spacing: 0.4px;
}

.dropzone-button {
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
}

.dropzone-preview {
    width: 80%;
    position: relative;
    &:hover .dropzone-button {
        display: block;
    }
    img {
      display: block;
      height: auto;
      max-width: 100%;
    }
    
}
</style>
