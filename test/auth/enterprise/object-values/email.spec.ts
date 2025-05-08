import { InvalidEmailError } from '@/auth/enterprise/errors/invalid-email.error'
import { Email } from '@/auth/enterprise/object-values/email'

describe('Email', () => {
  describe('UT', () => {
    describe('create', () => {
      it('should give an error if the email is invalid', () => {
        const email = 'invalid-email'

        expect(() => Email.create({ email })).toThrow(InvalidEmailError)
      })

      it('should create an email object if the email is valid', () => {
        const email = 'test@jhon.com'

        const emailObject = Email.create({ email })

        expect(emailObject.email).toEqual(email)
      })
    })

    describe('hydrate', () => {
      it('should hydrate an email object without checking the value', () => {
        const email = 'test-hydrate'

        const emailObject = Email.hydrate({ email })

        expect(emailObject.email).toEqual(email)
      })
    })
  })
})
