import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import {
  required,
  email,
  max,
  min,
  image,
  integer,
} from 'vee-validate/dist/rules'
import Vue from 'vue'

extend('required', {
  ...required,
  message: (field) => `${field} is required`,
})

extend('email', {
  ...email,
  message: 'Invalid email format',
})

extend('match', {
  validate(value, { match }: any) {
    return value === match
  },
  params: ['match'],
  message: (field) => `${field} does not match`,
})

extend('max', {
  ...max,
  message: (field, { length }) => `${field} too long. (${length} chars)`,
})

extend('min', {
  ...min,
  message: (field, { length }) => `${field} too short. (${length} chars)`,
})

extend('image', {
  ...image,
  message: (_field) => 'File should be an image',
})

extend('pdf', {
  validate(value: FileList) {
    if (value.length === 1) {
      const file = value[0]
      return file instanceof File && file.type === 'application/pdf'
    }
    return false
  },
  message: (field) => `${field} should be a pdf`,
})

extend('integer', {
  ...integer,
  message: (field) => `${field} must be an integer`,
})

extend('number', {
  validate(value: string) {
    return typeof +value === 'number'
  },
  message: (field) => `${field} must be a number`,
})

// TODO: Add password strength here

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
