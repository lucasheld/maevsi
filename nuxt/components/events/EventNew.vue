<template>
  <Form
    :function-submit="submit"
    :graphql-error-message="graphqlErrorMessage"
    :validation-object="$v.form"
  >
    <FormInput :title="'Name'" :v="$v">
      <input
        id="input-name"
        v-model.trim="$v.form['name'].$model"
        class="form-input"
        type="text"
        placeholder="Welcome Party"
        @input="updateSlug"
      />
      <div slot="formError">
        <FormError
          :text="'required'"
          :validation-object="$v.form['name']"
          :validation-property="'required'"
        />
        <FormError
          :text="'too long'"
          :validation-object="$v.form['name']"
          :validation-property="'maxLength'"
        />
      </div>
    </FormInput>
    <FormInput :title="'Slug'" :v="$v">
      <input
        id="input-slug"
        v-model.trim="$v.form['slug'].$model"
        class="form-input"
        type="text"
        placeholder="welcome-party"
      />
      <div slot="formError">
        <FormError
          :text="'required'"
          :validation-object="$v.form['slug']"
          :validation-property="'required'"
        />
        <FormError
          :text="'too long'"
          :validation-object="$v.form['slug']"
          :validation-property="'maxLength'"
        />
        <FormError
          :text="'incorrect format'"
          :validation-object="$v.form['slug']"
          :validation-property="'slugFormat'"
        />
      </div>
    </FormInput>
    <FormInput :title="'Visibility'" :v="$v">
      <FormRadioButtonGroup
        id="input-visibility"
        class="text-left"
        :name="'visibility'"
        :titles-values="[
          ['public', 'PUBLIC'],
          ['private', 'PRIVATE'],
        ]"
        @change="$v.form['visibility'].$model = $event"
      />
      <div slot="formError">
        <FormError
          :text="'required'"
          :validation-object="$v.form['visibility']"
          :validation-property="'required'"
        />
      </div>
    </FormInput>
    <FormInput :title="'Maximum Invitee Count'" :v="$v">
      <input
        id="input-maximum-invitee-count"
        v-model.trim="$v.form['maximum-invitee-count'].$model"
        class="form-input"
        type="number"
      />
      <div slot="formError">
        <FormError
          :text="'under minimum value'"
          :validation-object="$v.form['maximum-invitee-count']"
          :validation-property="'minValue'"
        />
      </div>
    </FormInput>
    <FormInput :title="'Description'" :v="$v">
      <textarea
        id="input-description"
        v-model.trim="$v.form['description'].$model"
        class="form-input"
      />
      <div slot="formError">
        <FormError
          :text="'too long'"
          :validation-object="$v.form['description']"
          :validation-property="'maxLength'"
        />
      </div>
    </FormInput>
    <FormInput :title="'Place'" :v="$v">
      <input
        id="input-place"
        v-model.trim="$v.form['place'].$model"
        class="form-input"
        type="text"
      />
      <div slot="formError">
        <FormError
          :text="'too long'"
          :validation-object="$v.form['place']"
          :validation-property="'maxLength'"
        />
      </div>
    </FormInput>
    <FormInput :title="'Start'" :v="$v">
      <Datetime
        v-model="$v.form['start'].$model"
        input-class="form-input"
        input-id="input-start"
        type="datetime"
      />
    </FormInput>
    <FormInput :title="'End'" :v="$v">
      <Datetime
        v-model="$v.form['end'].$model"
        input-class="form-input"
        input-id="input-end"
        :min-datetime="$v.form['start'].$model"
        type="datetime"
      />
    </FormInput>
    <div class="flex flex-col items-center justify-between">
      <Button
        :disabled="
          $v.form.$invalid ||
          (form.sent && !$v.form.$anyDirty && !graphqlErrorMessage)
        "
        :icon="false"
        type="submit"
      >
        Create event
      </Button>
    </div>
    <AlertGraphql
      :graphql-error-message="graphqlErrorMessage"
      :validation-object="$v.form"
      class="mt-4"
    />
  </Form>
</template>

<script>
import { Datetime } from 'vue-datetime'
import {
  helpers,
  maxLength,
  minValue,
  required,
} from 'vuelidate/lib/validators'

import EVENT_CREATE_MUTATION from '~/gql/mutation/eventCreate'

const consola = require('consola')

const slugFormat = helpers.regex('uuid', /^[-A-Za-z0-9]+$/)

export default {
  components: {
    Datetime,
  },
  data() {
    return {
      form: {
        description: undefined,
        end: undefined,
        'maximum-invitee-count': undefined,
        name: undefined,
        'organizer-username': undefined,
        place: undefined,
        sent: undefined,
        slug: undefined,
        start: new Date().toISOString(), // workaround for https://github.com/mariomka/vue-datetime/issues/177
        visibility: undefined,
      },
      graphqlErrorMessage: undefined,
    }
  },
  computed: {
    loggedInUsername() {
      return this.$store.state.jwtDecoded &&
        this.$store.state.jwtDecoded.role === 'maevsi_account' &&
        this.$store.state.jwtDecoded.exp > Math.floor(Date.now() / 1000)
        ? this.$store.state.jwtDecoded.username
        : undefined
    },
  },
  methods: {
    submit(e) {
      e.preventDefault()

      this.form.sent = true
      this.graphqlErrorMessage = undefined

      this.$v.form.$reset()
      this.$apollo
        .mutate({
          mutation: EVENT_CREATE_MUTATION,
          variables: {
            createEventInput: {
              event: {
                organizerUsername: this.loggedInUsername,
                description: this.form.description,
                end: this.form.end !== '' ? this.form.end : undefined,
                inviteeCountMaximum: +this.form['maximum-invitee-count'],
                name: this.form.name,
                place: this.form.place,
                slug: this.form.slug,
                start: this.form.start,
                visibility: this.form.visibility,
              },
            },
          },
        })
        .then((_data) => {
          alert('Success: Event created successfully.')
        })
        .catch((error) => {
          this.graphqlErrorMessage = error.message
          consola.error(error)
        })
    },
    updateSlug() {
      this.form.slug = this.$slugify(this.form.name, {
        lower: true,
        strict: true,
      })
    },
  },
  validations() {
    return {
      form: {
        name: {
          maxLength: maxLength(this.$global.EVENT_NAME_MAXIMUM),
          required,
        },
        slug: {
          maxLength: maxLength(this.$global.EVENT_SLUG_MAXIMUM),
          required,
          slugFormat,
        },
        visibility: {
          required,
        },
        'maximum-invitee-count': {
          minValue: minValue(1),
        },
        description: {
          maxLength: maxLength(this.$global.EVENT_DESCRIPTION_MAXIMUM),
        },
        place: {
          maxLength: maxLength(this.$global.EVENT_PLACE_MAXIMUM),
        },
        start: {
          required,
        },
        end: {},
      },
    }
  },
}
</script>
