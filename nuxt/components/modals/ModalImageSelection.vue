<template>
  <Modal @close="modalHideFunction()">
    <h2 slot="header">Select a profile picture</h2>
    <ImageUploadGallery
      slot="body"
      :allow-addition="false"
      :allow-deletion="false"
      :selection-function="selectProfilePictureStorageKey"
    />
    <div slot="footer" class="text-white">
      <Button
        :disabled="settingProfilePicture"
        :icon-id="['fas', 'window-close']"
        @click.native="modalHideFunction()"
      >
        Cancel
      </Button>
      <ButtonGreen
        :disabled="
          settingProfilePicture ||
          selectedProfilePictureStorageKey === undefined
        "
        :icon-id="['fas', 'check-circle']"
        @click.native="setProfilePicture()"
      >
        Select
      </ButtonGreen>
    </div>
    <div if="graphqlErrorMessage !== undefined">
      <AlertGraphql :graphql-error-message="graphqlErrorMessage" />
    </div>
  </Modal>
</template>

<script>
import PROFILE_PICTURE_SET_MUTATION from '~/gql/mutation/profilePictureSet'

const consola = require('consola')

export default {
  props: {
    modalHideFunction: {
      type: Function,
      default: undefined,
    },
    reloadFunction: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      graphqlErrorMessage: undefined,
      selectedProfilePictureStorageKey: undefined,
      settingProfilePicture: false,
    }
  },
  methods: {
    selectProfilePictureStorageKey(storageKey) {
      this.selectedProfilePictureStorageKey = storageKey
    },
    setProfilePicture() {
      this.settingProfilePicture = true

      this.$apollo
        .mutate({
          mutation: PROFILE_PICTURE_SET_MUTATION,
          variables: {
            storageKey: this.selectedProfilePictureStorageKey,
          },
        })
        .then((_data) => {
          this.reloadFunction()
          this.modalHideFunction()
        })
        .catch((error) => {
          this.graphqlErrorMessage = error.message
          consola.error(error)
        })
        .finally(() => {
          this.settingProfilePicture = false
        })
    },
  },
}
</script>
