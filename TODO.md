expiry date tracker

## TODO

- [ ] notifications for when expiry is close
  - [x] reminder page
  - [x] item specific reminder should inherit from user global settings
  - [ ] set up job to send notifications
- [ ] move item down when quantity reaches 0
- [ ] search bar
  - [ ] labels page
  - [ ] items page
  - [ ] reminders page
- [ ] improve type export mechanism
- [ ] flexible sorting on items table
- [ ] label swatch
- [ ] access control based on user role

  - [x] add user id to item records and test on /items/:id
  - [ ] admin can do everything
  - [x] user can only operate on their own items

- [ ] admin panel
- [x] availableModals typing error
- [x] DB setup
- [x] Password hashing
- [x] user api
- [x] share types
- [x] write server in ts
- [x] Category API
- [x] Item API
- [x] Icon performance
- [x] Track amount via Quantity and Unit
- [x] Notes impl
- [x] note should be more elaborate - work with object not string
- [x] move away from context modals
- [x] go through logic for default reminder and when its disabled, and when default/item reminder doesn't exist
- [x] react query cache invalidation flaky (e.g. creating item, label)
