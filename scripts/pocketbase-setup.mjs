// One-time setup script: creates the `user_progress` collection and the extra
// profile fields (xp, streak, last_active) on the built-in `users` collection.
//
// Usage:
//   PB_URL=http://127.0.0.1:8090 PB_SUPERUSER_EMAIL=you@example.com PB_SUPERUSER_PASSWORD=yourpassword node scripts/pocketbase-setup.mjs
//
import PocketBase from 'pocketbase'

const url = process.env.PB_URL ?? 'http://127.0.0.1:8090'
const email = process.env.PB_SUPERUSER_EMAIL
const password = process.env.PB_SUPERUSER_PASSWORD

if (!email || !password) {
  console.error('Set PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD env vars (the PocketBase admin/superuser account).')
  process.exit(1)
}

const pb = new PocketBase(url)

async function main() {
  await pb.collection('_superusers').authWithPassword(email, password)
  console.log(`Authenticated as superuser at ${url}`)

  const usersCollection = await pb.collections.getOne('users')
  const existingFieldNames = new Set(usersCollection.fields.map((f) => f.name))

  const extraFields = [
    { name: 'xp', type: 'number', required: false },
    { name: 'streak', type: 'number', required: false },
    { name: 'last_active', type: 'date', required: false },
  ]
  const fieldsToAdd = extraFields.filter((f) => !existingFieldNames.has(f.name))

  if (fieldsToAdd.length > 0) {
    await pb.collections.update(usersCollection.id, {
      fields: [...usersCollection.fields, ...fieldsToAdd],
    })
    console.log(`Added fields to users: ${fieldsToAdd.map((f) => f.name).join(', ')}`)
  } else {
    console.log('users collection already has xp/streak/last_active fields.')
  }

  const existing = await pb.collections.getFullList({ filter: 'name = "user_progress"' }).catch(() => [])
  if (existing.length > 0) {
    console.log('user_progress collection already exists, skipping creation.')
    return
  }

  await pb.collections.create({
    name: 'user_progress',
    type: 'base',
    fields: [
      {
        name: 'user',
        type: 'relation',
        required: true,
        collectionId: usersCollection.id,
        cascadeDelete: true,
        maxSelect: 1,
      },
      {
        name: 'module',
        type: 'select',
        required: true,
        maxSelect: 1,
        values: ['travel', 'work', 'family', 'relationships', 'friends'],
      },
      { name: 'lesson_index', type: 'number', required: true },
      { name: 'stars', type: 'number', required: true },
      { name: 'mistakes', type: 'number', required: true },
      { name: 'completed_at', type: 'date', required: true },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_user_progress_unique ON user_progress (user, module, lesson_index)'],
    listRule: '@request.auth.id = user',
    viewRule: '@request.auth.id = user',
    createRule: '@request.auth.id = user',
    updateRule: '@request.auth.id = user',
    deleteRule: '@request.auth.id = user',
  })
  console.log('Created user_progress collection.')
}

main().catch((err) => {
  console.error('Setup failed:', err?.response ?? err)
  process.exit(1)
})
